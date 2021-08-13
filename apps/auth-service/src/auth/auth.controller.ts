import { Controller, Get, Request, Post, UseGuards, Header, Body } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @Header('Access-Control-Allow-Origin', '*')
  async login(@Body() data: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(data);
  }

  @Post('/signup')
  async signup(@Body() data: RegistrationDto): Promise<{ access_token: string }> {
    return this.authService.signup(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<any> {
    return this.authService.getProfile(req.user);
  }
}
