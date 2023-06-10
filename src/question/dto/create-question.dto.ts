import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsBoolean()
  is_multiple_answer: boolean;

  @IsNotEmpty()
  @IsString()
  test_id: string;
}
