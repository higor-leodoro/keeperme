import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UserService } from '../user/user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { AppleLoginDto, LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private appleJWKS: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(this.config.get('GOOGLE_CLIENT_ID'));
    this.appleJWKS = createRemoteJWKSet(
      new URL('https://appleid.apple.com/auth/keys'),
    );
  }

  async validateGoogleToken(token: string) {
    let googleUser: {
      sub: string;
      email: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
    };

    try {
      // Try as ID token first (mobile apps)
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.config.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Token');
      }
      googleUser = payload as typeof googleUser;
    } catch {
      // Fallback: try as access token (web app)
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const data = await response.json();
      if (!data.sub || !data.email) {
        throw new UnauthorizedException('Invalid Google token');
      }
      googleUser = data;
    }

    const user = await this.usersService.findOrCreate({
      email: googleUser.email,
      googleId: googleUser.sub,
      name: googleUser.given_name ?? '',
      lastName: googleUser.family_name ?? '',
      photo: googleUser.picture ?? '',
    });

    return user;
  }

  async loginWithGoogle(token: string) {
    const user = await this.validateGoogleToken(token);
    const { id, email, name, lastName, photo } = user;
    const validUser: UserResponseDto = {
      id,
      email,
      name,
      lastName,
      photo,
    };
    const jwtToken = await this.jwtService.signAsync({ sub: id, email });
    return {
      user: validUser,
      token: jwtToken,
    };
  }

  async loginWithJwtToken(sub: string) {
    const user = await this.usersService.findOne(sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async registerWithPassword(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createWithPassword({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      lastName: dto.lastName,
    });

    const { id, email, name, lastName, photo } = user;
    const validUser: UserResponseDto = { id, email, name, lastName, photo };
    const token = await this.jwtService.signAsync({ sub: id, email });

    return { user: validUser, token };
  }

  async loginWithPassword(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Google sign-in. Please use the Google button.',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, email, name, lastName, photo } = user;
    const validUser: UserResponseDto = { id, email, name, lastName, photo };
    const token = await this.jwtService.signAsync({ sub: id, email });

    return { user: validUser, token };
  }

  async validateAppleToken(identityToken: string) {
    try {
      const { payload } = await jwtVerify(identityToken, this.appleJWKS, {
        issuer: 'https://appleid.apple.com',
        audience: this.config.get('APPLE_BUNDLE_ID'),
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid Apple token');
      }

      return payload;
    } catch (error) {
      console.error('Apple token validation error:', error);
      throw new UnauthorizedException('Invalid Apple token');
    }
  }

  async loginWithApple(dto: AppleLoginDto) {
    const payload = await this.validateAppleToken(dto.identityToken);

    // Determinar email na ordem de prioridade
    const email =
      dto.email || // Do credential (primeira vez)
      (payload.email as string) || // Do token (primeira vez)
      `apple-${payload.sub}@noreply.keeperme.app`; // Fallback

    const user = await this.usersService.findOrCreateApple({
      appleId: payload.sub as string,
      email: email,
      name: dto.fullName || '',
      lastName: '',
      photo: '',
    });

    const { id, name, lastName, photo } = user;
    const validUser: UserResponseDto = {
      id,
      email: user.email,
      name,
      lastName,
      photo,
    };
    const jwtToken = await this.jwtService.signAsync({
      sub: id,
      email: user.email,
    });

    return {
      user: validUser,
      token: jwtToken,
    };
  }
}
