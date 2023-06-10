import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsNotEmpty()
  @IsBoolean()
  is_right: boolean;

  @IsNotEmpty()
  @IsString()
  question_id: string;
}
