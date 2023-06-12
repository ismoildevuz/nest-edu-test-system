import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateResultDto {
  @IsNotEmpty()
  @IsNumber()
  time_spent: number;

  @IsNotEmpty()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsString()
  test_id: string;
}
