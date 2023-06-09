import { IsNotEmpty, IsString } from 'class-validator';

export class AuthAdminDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
