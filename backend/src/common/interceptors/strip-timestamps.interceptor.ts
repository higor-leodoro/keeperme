import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class StripTimestampsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const strip = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(strip);
      }
      if (obj && typeof obj === 'object') {
        const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = obj;
        for (const key of Object.keys(rest)) {
          rest[key] = strip(rest[key]);
        }
        return rest;
      }
      return obj;
    };

    return next.handle().pipe(map((data) => strip(data)));
  }
}
