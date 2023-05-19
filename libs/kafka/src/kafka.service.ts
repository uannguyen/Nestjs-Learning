import { KAFKA_PROVIDER_NAME, KAFKA_TOPICS } from '@app/define';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(@Inject(KAFKA_PROVIDER_NAME) private client: ClientKafka) {}
  async onModuleInit() {
    this.subcribeTopic();
    await this.client.connect();
  }
  subcribeTopic() {
    if (this.client.subscribeToResponseOf) {
      Object.keys(KAFKA_TOPICS).forEach((topic) => {
        this.client.subscribeToResponseOf(topic);
      });
    }
  }
  send(pattern: string, data: any) {
    return this.client.send(pattern, data).subscribe(
      (response) => null,
      (error) => Logger.error(error, 'Kafka send event'),
    );
  }

  emit(pattern: string, data: any) {
    return this.client.emit(pattern, data).subscribe(
      (response) => null,
      (error) => Logger.error(error, 'Kafka emit event'),
    );
  }
}
