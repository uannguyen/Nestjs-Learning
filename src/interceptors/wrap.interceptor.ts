import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class WrapFuncInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.log("---------------ReqInterceptor before");
    return next.handle().pipe(
      map((data) => {
        Logger.log("---------------ReqInterceptor after");
        return { data };
      })
    );
    // return next.handle().pipe(
    //   tap(() => {
    //     console.log('ReqInterceptor after request handle method');
    //   }),
    // );
  }
}
