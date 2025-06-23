import { registerAs } from '@nestjs/config';

export default registerAs('oauth', () => ({
  github: {
    clientID: process.env.GITHUB_CLIENT_ID || 'github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'github-client-secret',
    callbackURL: 'http://localhost:3000/auth/github/callback',
  },
}));
