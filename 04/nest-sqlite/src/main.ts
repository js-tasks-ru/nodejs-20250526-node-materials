import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedErrorFilter } from './filter/queryFailedError.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new QueryFailedErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
