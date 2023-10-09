import { UserType } from "@prisma/client";
import { IsString,IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional } from "class-validator";
import { ApiProperty} from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

// enum UserType {
//   BUYER,
//   REALTOR,
//   ADMIN
// }

// enum UserType {
//   "BUYER",
//   "REALTOR",
//   "ADMIN"
// }
export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,{message:"phon must be a valid phone number"})
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;


  @ApiProperty()
  @IsString()
  @MinLength(5)
  password:string;


  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?:string


  
}

export class SigninDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password:string;
}
export class UserTypeDto{
  @IsEnum(UserType)
  userType: UserType
}

export class GenerateProductKeyDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @Exclude()
  @ApiProperty()
  @Type(() => UserTypeDto) 
  userType: UserTypeDto; 
}

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  user_type: string;

  @Expose()
  @ApiProperty()
  token:string
}
