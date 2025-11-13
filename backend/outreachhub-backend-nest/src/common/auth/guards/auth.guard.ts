import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/admin.schema';
import { AdminService } from 'src/admin/admin.service';
import { Token } from 'src/common/schema/token.schema';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private userService: UserService,
    private adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.isAdmin) {
        const admin: Admin = await this.adminService.findAdminById(
          payload.adminId,
        );
        if (!admin || admin.isDeleted) {
          return false;
        }
        const tokenEntry = await this.tokenModel.findOne({
          adminId: admin._id,
          token: token,
        });
        if (!tokenEntry) {
          return false;
        }
        req.user = payload;
      } else if (payload.userId) {
        const user: User = await this.userService.getUserById(payload.userId);
        if (!user || user.isDeleted) {
          return false;
        }
        const tokenEntry = await this.tokenModel.findOne({
          userId: user._id,
          token: token,
        });
        if (!tokenEntry) {
          return false;
        }
        req.user = payload;
      }
      return true;
    } catch (err) {
      return false;
    }
    return false;
  }
}
