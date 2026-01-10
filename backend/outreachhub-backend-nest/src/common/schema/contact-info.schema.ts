import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ContactInfo {
  @Prop({ required: true, type: String })
  countryCode: string;
  @Prop({ required: true, type: Number })
  phoneNo: number;
  @Prop({
    required: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  })
  email: string;
}
export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
