import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  time_limit?: number;

  @IsOptional()
  @IsString()
  subject_id?: string;
}
