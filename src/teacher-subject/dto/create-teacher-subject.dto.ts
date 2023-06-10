import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeacherSubjectDto {
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @IsNotEmpty()
  @IsString()
  subject_id: string;
}
