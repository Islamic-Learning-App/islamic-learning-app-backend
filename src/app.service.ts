import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}
  getHealth(): { status: string; uptime: number; timestamp: string } {
    return {
      status: 'up',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
