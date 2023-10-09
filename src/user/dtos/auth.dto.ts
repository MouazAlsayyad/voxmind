import { User, UserType } from "@prisma/client";
import { IsString,IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional } from "class-validator";
import { ApiProperty} from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";


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

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  user_type: string;

  @ApiProperty()
  token:string

  constructor(user: User,token:string) {
    this.id = user.id;
    this.name = user.name;
    this.phone = user.phone;
    this.email = user.email;
    this.user_type = user.user_type;
    this.token = token
  }

}
