import { forwardRef, Module } from "@nestjs/common";
import { AwsS3Controller } from "./aws-s3.controller";
import { AwsS3Service } from "./aws-s3.service";
import { AuthModule } from "src/common/auth/auth.module";
import { AdminModule } from "src/admin/admin.module";
import { UserModule } from "src/user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "src/common/schema/token.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WorkspaceModule } from "src/workspace/workspace.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
    forwardRef(() => WorkspaceModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt_key"),
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [AwsS3Controller],
  providers: [AwsS3Service],
})
export class AwsS3Module {}
