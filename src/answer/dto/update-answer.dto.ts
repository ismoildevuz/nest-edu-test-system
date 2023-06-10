import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsBoolean()
  is_right?: boolean;

  @IsOptional()
  @IsString()
  question_id?: string;
}
