import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { User, UserType } from '@prisma/client';
import { SigninDto, SignupDto, UserResponseDto, UserTypeDto } from '../dtos/auth.dto';


const signToken = async (user:User)=>{
  return jwt.sign({
    name: user.name,
    id: user.id
  }, process.env.JSON_TOKEN_KEY, {
    expiresIn: process.env.JSON_TOKEN_EXPIRERS_IN
  })
  
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma:Prisma){}
  
  async signup({email,password,name,phone,productKey}:SignupDto,userType:UserTypeDto){
    if(userType.userType !== UserType.BUYER){
      if(!productKey){
        throw new UnauthorizedException()
      }
      const validProductKey = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
      const isValidProductKey = await bcrypt.compare(validProductKey,productKey)
      if(!isValidProductKey)
      {
        throw new UnauthorizedException() 
      }
  }

    const userExists = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if(userExists){
      throw new ConflictException('email already exists')
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await this.prisma.user.create({
      data:{
        email,
        name,
        password:hashedPassword,
        phone,
        user_type: userType.userType
      }
    })

    const token = await signToken(user)

    const userResponse = new UserResponseDto(user as User, token);


    return userResponse
  }

  async signin({email,password}: SigninDto){
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if(!user||!(await bcrypt.compare(password,user.password))){
      throw new HttpException('Invalid credentials',400)
    }

    const token = await signToken(user)

    return {user,token}

  }

  
  generateProductKet(email:string,userType:UserTypeDto){
    const string  =`${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

    return bcrypt.hash(string,10)
  }

}

