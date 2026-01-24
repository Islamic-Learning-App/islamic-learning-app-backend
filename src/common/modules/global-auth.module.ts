import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../modules/user/user.module';
import { TokenService } from '../services/token.service';

@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'default-secret',
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn') || '1d') as any,
        },
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class GlobalAuthModule {}
