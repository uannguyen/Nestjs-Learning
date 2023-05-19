import { ConnectModule } from '@app/connect';
import { KafkaModule } from '@app/kafka';
import { TracerModule } from '@app/tracer';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import * as Services from './services';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ConnectModule,
    TracerModule,
    HttpModule,
    KafkaModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [...Object.values(Services)],
})
export class AppModule {}
