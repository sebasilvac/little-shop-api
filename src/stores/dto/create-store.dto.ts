import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateStoreDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
