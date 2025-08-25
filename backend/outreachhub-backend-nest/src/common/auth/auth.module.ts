import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/admin/admin.module';
import { Token, TokenSchema } from '../schema/token.schema';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import {
  WorkspaceUser,
  WorkspaceUserSchema,
} from 'src/workspaceUser/workspaceUser.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
    forwardRef(() => WorkspaceModule),
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: WorkspaceUser.name,
        schema: WorkspaceUserSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.jwt_key,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
