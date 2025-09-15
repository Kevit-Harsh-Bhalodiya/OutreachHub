import { forwardRef, Module } from '@nestjs/common';
import { CampaignMessageController } from './campaign-message.controller';
import { CampaignMessageService } from './campaign-message.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampaignMessage,
  CampaignMessageSchema,
} from './campaign-message.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageTemplateModule } from 'src/message-template/message-template.module';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Token, TokenSchema } from 'src/common/schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: CampaignMessage.name,
        schema: CampaignMessageSchema,
      },
    ]),
    forwardRef(() => MessageTemplateModule),
    forwardRef(() => UserModule),
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
  controllers: [CampaignMessageController],
  providers: [CampaignMessageService],
  exports: [CampaignMessageService],
})
export class CampaignMessageModule {}
