import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResultAnswerDto {
  @IsNotEmpty()
  @IsString()
  result_question_id: string;

  @IsNotEmpty()
  @IsString()
  answer_id: string;
}
