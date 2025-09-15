import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './contact.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Token, TokenSchema } from 'src/common/schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      {
        name: Contact.name,
        schema: ContactSchema,
      },
    ]),
    forwardRef(() => WorkspaceModule),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
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
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
