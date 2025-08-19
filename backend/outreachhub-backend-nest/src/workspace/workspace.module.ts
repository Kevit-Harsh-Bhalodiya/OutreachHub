import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';
import { Workspace, WorkspaceSchema } from './workspace.schema';
import { UserModule } from 'src/user/user.module';
import {
  WorkspaceUser,
  WorkspaceUserSchema,
} from 'src/workspaceUser/workspaceUser.schema';
import { WorkspaceMembershipService } from './workspace-membership.service';
import { AuthModule } from 'src/common/auth/auth.module';
import { Token, TokenSchema } from 'src/common/schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: Workspace.name,
        schema: WorkspaceSchema,
      },
      {
        name: WorkspaceUser.name,
        schema: WorkspaceUserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceMembershipService],
  exports: [WorkspaceService, WorkspaceMembershipService],
})
export class WorkspaceModule {}
