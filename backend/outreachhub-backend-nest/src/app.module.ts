import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './common/auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { UserModule } from './user/user.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { ContactModule } from './contact/contact.module';
import { CampaignModule } from './campaign/campaign.module';
import { CampaignMessageModule } from './campaign-message/campaign-message.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AwsS3Module } from './aws-s3/aws-s3.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo_db'),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_key'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    AuthModule,
    AdminModule,
    WorkspaceModule,
    UserModule,
    MessageTemplateModule,
    ContactModule,
    CampaignModule,
    CampaignMessageModule,
    AwsS3Module,
  ],
})
export class AppModule {}
