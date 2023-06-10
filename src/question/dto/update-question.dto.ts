import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsBoolean()
  is_multiple_answer?: boolean;

  @IsOptional()
  @IsString()
  test_id?: string;
}
