import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UserService } from '../user/user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { AppleLoginDto } from './dtos';

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
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: this.config.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = await this.usersService.findOrCreate({
      email: payload.email,
      googleId: payload.sub,
      name: payload.given_name ?? '',
      lastName: payload.family_name ?? '',
      photo: payload.picture ?? '',
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
