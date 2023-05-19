import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from 'src/services';
import { WrapFuncInterceptor } from '../interceptors';

@UseInterceptors(WrapFuncInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return 'Hello World!';
  }
}
