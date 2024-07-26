import { IsEnum, IsNotEmpty } from 'class-validator';

export enum DocumentTypeEnum {
  id_card = 'id_card',
  selfie = 'selfie',
}

export class UserKycDto {
  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum, { message: 'Tipe Dokumen tidak valid' })
  document_type: DocumentTypeEnum;
}
