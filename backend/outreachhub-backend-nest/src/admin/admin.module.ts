import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Token, TokenSchema } from 'src/common/schema/token.schema';
import { UserModule } from 'src/user/user.module';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => CampaignModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule { }
