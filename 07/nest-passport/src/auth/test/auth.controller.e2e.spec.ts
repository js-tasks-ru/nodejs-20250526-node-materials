import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from '../../config/jwt';
import dbConfig from '../../config/database';
import oauthConfig from '../../config/oauth';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../jwt.guard';
import { JwtService } from '@nestjs/jwt';

describe('Cats', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig, dbConfig, oauthConfig],
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(dbConfig.asProvider()),
        AuthModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtGuard,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    await app.init();
  });

  it(`/GET profile`, async () => {
    const token = await jwtService.signAsync({
      username: 'John',
      role: 'admin',
    });

    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('John');
    expect(response.body.role).toEqual('admin');
  });

  afterAll(async () => {
    await app.close();
  });
});
