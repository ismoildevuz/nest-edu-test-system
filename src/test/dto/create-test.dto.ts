import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  time_limit: number;

  @IsNotEmpty()
  @IsString()
  subject_id: string;
}
