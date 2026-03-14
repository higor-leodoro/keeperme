import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { Public } from '../../common/decorators/public.route.decorator';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt.strategy';
import { GoogleLoginDto, AppleLoginDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('google')
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.token);
  }

  @Public()
  @Post('apple')
  async appleLogin(@Body() dto: AppleLoginDto) {
    return this.authService.loginWithApple(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('me')
  async autoSignin(@CurrentUser() user: JwtPayload) {
    return this.authService.loginWithJwtToken(user.sub);
  }
}
