import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { Token } from 'src/common/token.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false; // No token provided
    }
    const token = authHeader.split(' ')[1];
    try {
      const decode = await this.jwtService.verifyAsync(token);
      if (!decode || !decode.userId) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const tokenExists = await this.tokenModel.findOne({
        token: token,
        userId: decode.userId,
      });
      if (tokenExists && tokenExists.token === token) {
        req['data'] = decode;
        return true;
      }
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
