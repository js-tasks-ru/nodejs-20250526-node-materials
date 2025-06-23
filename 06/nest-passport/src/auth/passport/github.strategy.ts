import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('oauth.github.clientID'),
      clientSecret: configService.get('oauth.github.clientSecret'),
      callbackURL: configService.get('oauth.github.callbackURL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);

    let user = await this.usersService.findOne(profile.username);
    if (!user) {
      user = await this.usersService.create(profile.username);
    }

    return user;
  }
}
