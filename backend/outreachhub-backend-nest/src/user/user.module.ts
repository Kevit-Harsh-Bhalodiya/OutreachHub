import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WorkspaceUser,
  WorkspaceUserSchema,
} from 'src/workspaceUser/workspaceUser.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Token, TokenSchema } from 'src/common/schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: WorkspaceUser.name,
        schema: WorkspaceUserSchema,
      },
    ]),
    forwardRef(() => AdminModule),
    forwardRef(() => WorkspaceModule),
    forwardRef(() => AuthModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
