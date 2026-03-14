import { IsString, IsEmail } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  lastName: string | null;
  @IsEmail()
  email: string;
  @IsString()
  photo: string | null;
}
