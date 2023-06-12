import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateResultQuestionDto {
  @IsNotEmpty()
  @IsBoolean()
  is_right: boolean;

  @IsNotEmpty()
  @IsString()
  result_id: string;

  @IsNotEmpty()
  @IsString()
  question_id: string;
}
