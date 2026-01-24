import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from '../../modules/auth/interfaces/auth.interface';
import { UserService } from '../../modules/user/user.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const payload = this.tokenService.verifyToken(token);
    const user = await this.userService.findById(payload._id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Attach the actual database user to the request object
    // Attach the actual database user to the request object
    request.user = user.toJSON() as unknown as AuthenticatedRequest['user'];

    return true;
  }
}
