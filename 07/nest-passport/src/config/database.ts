import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', () => {
  return {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    autoLoadEntities: true,
  } as TypeOrmModuleOptions;
});
