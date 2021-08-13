import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { EMAIL_REGEXP, PASSWORD_REGEXP } from '@app/shared/constant/regExp';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(EMAIL_REGEXP, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEXP, { message: 'Invalid password format' })
  password: string;
}
