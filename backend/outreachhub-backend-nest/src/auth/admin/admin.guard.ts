import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './token.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];
    try {
      const decode = await this.jwtService.verifyAsync(token);
      if (!decode || !decode.adminId) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const tokenExists = await this.tokenModel.findOne({
        token: token,
        adminId: decode.adminId,
      });
      if (tokenExists && tokenExists.token === token) {
        return true;
      }
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
