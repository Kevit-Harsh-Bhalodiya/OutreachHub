import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { AdminOrUserGuard } from 'src/common/auth/guards/admin-or-user.guard';
import { WriteGuard } from 'src/common/auth/guards/write.guard';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private s3Service: AwsS3Service) {}
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, AdminOrUserGuard, WriteGuard)
  async uploadImage(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|jpg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('request');
    return this.s3Service.uploadFile(file, req);
  }
}
