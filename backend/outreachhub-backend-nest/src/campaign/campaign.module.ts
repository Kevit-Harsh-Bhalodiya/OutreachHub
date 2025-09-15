import { forwardRef, Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './campaign.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactModule } from 'src/contact/contact.module';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { CampaignMessageModule } from 'src/campaign-message/campaign-message.module';
import { MessageTemplateModule } from 'src/message-template/message-template.module';
import { Token, TokenSchema } from 'src/common/schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => CampaignMessageModule),
    forwardRef(() => ContactModule),
    forwardRef(() => MessageTemplateModule),
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
    forwardRef(() => WorkspaceModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
