import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }
  async uploadFile(file: Express.Multer.File, req: any) {
    if (!file) {
      throw new Error('No file provided');
    }
    const bucket = this.configService.get<string>('AWS_S3_BUCKET')!;
    const key = `images/${Date.now()}-${req.user.userId}-${path.extname(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return {
      url: `https://${bucket}.s3.${this.configService.get<string>(
        'AWS_REGION',
      )}.amazonaws.com/${key}`,
    };
  }
}
