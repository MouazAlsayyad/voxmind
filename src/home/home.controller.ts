import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, IdParamDto, InquireDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';

import { ApiForbiddenResponse, ApiQuery, ApiTags } from '@nestjs/swagger';


@ApiTags('homes')
@Controller('home')
export class HomeController {

  constructor(private readonly homeService:HomeService){}

  
  @Get()
  @ApiQuery({ name: 'city', required: false, type: String }) 
  @ApiQuery({ name: 'minPrice', required: false, type: String }) 
  @ApiQuery({ name: 'maxPrice', required: false, type: String })
  @ApiQuery({ name: 'propertyType', required: false, enum: PropertyType })
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {

    const price = minPrice || maxPrice ? {
      ...(minPrice && {gte: parseFloat(minPrice)}),
      ...(maxPrice && {lte: parseFloat(maxPrice)}),
    } : undefined


    const filters = {
      ...(city &&{city}),
      ...(price &&{price}),
      ...(propertyType &&{propertyType}),
    }

    return this.homeService.getHomes(filters)
  }

  @Get(':id')
  getHome(@Param() params: IdParamDto){
    return this.homeService.getHomeById(params.id)
  }

  @ApiForbiddenResponse({description:"Forbidden"})
  @Roles(UserType.REALTOR)
  @Post()
  createHome( @Body() body:CreateHomeDto,@User() user:UserInfo) {
    return this.homeService.createHome(body,user.id)
  }

  @ApiForbiddenResponse({description:"Forbidden"})
  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param() params: IdParamDto,
    @Body() body: UpdateHomeDto
    ,@User() user:UserInfo
  ){
    const realtor = await this.homeService.getRealtorByHomeId(params.id)

    if(realtor.id !== user.id){
      throw new UnauthorizedException()
    }

    return this.homeService.updateHomeById(params.id,body)
  }

  @ApiForbiddenResponse({description:"Forbidden"})
  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHome(@Param() params: IdParamDto,@User() user:UserInfo){
    
    const realtor = await this.homeService.getRealtorByHomeId(params.id)

    if(realtor.id !== user.id){
      throw new UnauthorizedException()
    }
    return this.homeService.deleteHomeById(params.id)
  }

  @ApiForbiddenResponse({description:"Forbidden"})
  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquire(
    @Param() params: IdParamDto,
    @User() user:UserInfo,
    @Body() {message}:InquireDto
  ){
    return this.homeService.inquire(user,params.id,message)
  }

  @ApiForbiddenResponse({description:"Forbidden"})
  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param() params: IdParamDto,
    @User() user:UserInfo,
  ){
    const realtor = await this.homeService.getRealtorByHomeId(params.id)

    if(realtor.id !== user.id){
      throw new UnauthorizedException()
    }
    return this.homeService.getMessagesByHome(params.id)
  }

}
