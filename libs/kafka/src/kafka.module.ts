import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class KafkaModule {
  static forRoot(): DynamicModule {
    const imports = [];
    const providers: any = [];
    const exports = [];

    // if (process.env.KAFKA_URL) {
    //   imports.push(
    //     ClientsModule.register([
    //       {
    //         name: KAFKA_PROVIDER_NAME,
    //         transport: Transport.KAFKA,
    //         options: {
    //           client: {
    //             clientId: KAFKA_CLIENT_ID,
    //             brokers: [process.env.KAFKA_URL],
    //             logLevel: 0,
    //           },
    //           consumer: { groupId: KAFKA_GROUP_ID },
    //         },
    //       },
    //     ]),
    //   );
    //   providers.push(KafkaService);
    //   exports.push(KafkaService);
    // }

    return {
      module: KafkaModule,
      imports,
      providers,
      exports,
    };
  }
}
