import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();

  await app.listen(process.env.PORT, () => {
    Logger.log(
      'Listening at http://localhost:' + process.env.PORT + '/' + globalPrefix,
    );
  });
}
bootstrap();
