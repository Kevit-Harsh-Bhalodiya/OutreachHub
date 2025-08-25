import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private userService: UserService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User credentials not found.');
    }
    try {
      const dbUser = await this.userService.getUserById(userId);
      if (dbUser) {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid user credentials.');
    }
    throw new UnauthorizedException('Invalid user credentials.');
  }
}
