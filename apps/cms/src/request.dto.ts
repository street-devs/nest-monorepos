import { ApiProperty, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import {
  FileSystemStoredFile,
  IsFile,
  IsFiles,
  MaxFileSize,
} from 'nestjs-form-data'

export class RequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public key: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public otherFields: string

  @IsFile()
  @MaxFileSize(1024 * 1024 * 30)
  public file: FileSystemStoredFile
}

export class RequestMultipleDto extends OmitType(RequestDto, ['file']) {
  @IsFiles()
  @MaxFileSize(1024 * 1024 * 30, { each: true })
  public files: FileSystemStoredFile[]
}
