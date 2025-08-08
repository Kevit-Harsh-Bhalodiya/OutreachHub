import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { Workspace, WorkspaceSchema } from './workspace.schema';
import { Token, TokenSchema } from 'src/common/token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Workspace.name,
        schema: WorkspaceSchema,
      },
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
