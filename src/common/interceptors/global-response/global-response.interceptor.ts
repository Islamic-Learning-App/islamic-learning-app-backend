import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response.interface';

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        if (data && typeof data === 'object' && 'message' in data) {
          const { message, ...rest } = data as {
            message?: string;
            data?: unknown;
            [key: string]: unknown;
          };

          let responseData: unknown = data;
          if (Object.keys(rest).length > 0) {
            // If the response specifically contains a 'data' property, use its value
            // otherwise use the rest of the object
            responseData = 'data' in rest && Object.keys(rest).length === 1 ? rest.data : rest;
          }

          return {
            success: true,
            message: (typeof message === 'string' ? message : undefined) || 'Request successful',
            data: responseData as T,
          };
        }
        // Otherwise use default message
        return {
          success: true,
          message: 'Request successful',
          data: data,
        };
      }),
    );
  }
}
