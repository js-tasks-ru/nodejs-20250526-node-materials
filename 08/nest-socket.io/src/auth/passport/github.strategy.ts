import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: 'Iv23liw5EoeurfgwXBqx',
      clientSecret: '8e8ae77de02faf342f30fe557b78799e76bec867',
      callbackURL: 'http://localhost:3000/auth/github/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.socialLogin(profile.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
