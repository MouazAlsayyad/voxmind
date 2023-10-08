import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeFilterDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';

import { UserInfo } from 'src/user/decorators/user.decorator';


export const homeSelect = {
  id :true,
  address:true,
  city  :true,
  price  :true,
  propertyType  :true,
  number_of_bedroom  :true,
  number_of_bathrooms  :true,
}

@Injectable()
export class HomeService {
  constructor(private readonly prisma:PrismaService){}
  async getHomes(filter: HomeFilterDto): Promise<HomeResponseDto[]> {
    const price = filter.minPrice || filter.maxPrice ? {
      ...(filter.minPrice && {gte: parseFloat(filter.minPrice.toString())}),
      ...(filter.maxPrice && {lte: parseFloat(filter.maxPrice.toString())}),
    } : undefined
    delete filter?.minPrice;
    delete filter?.maxPrice;

      filter = {
      ...filter,
      ...(price &&{price}),
      }

    const homes = await this.prisma.home.findMany({
      select:{
        ...homeSelect,
        images:{
          select:{
            url:true
          },
          take:1
        }
      },
      where: {
        ...filter
      }
    })

      if(!homes.length){
        throw new NotFoundException()
      }

    return homes.map((home)=> {
      const fetchHome  = {...home,image:home.images[0].url}
      delete fetchHome.images
      return new HomeResponseDto(fetchHome)
    })
  }

  async getHomeById(id:number):Promise<HomeResponseDto> {
    const home  = await this.prisma.home.findUnique({
      where:{
        id
      },
      select:{
        ...homeSelect,
        images:{
          select:{
            url:true
          }
        },
        realtor:{
          select:{
            name:true,
            email:true,
            phone:true
          }
        }
      },
    })

    if(!home){
      throw new NotFoundException(`Home #${id} not found`)
    }
    
    return new HomeResponseDto(home)
  }


  async createHome({address, numberOfBedroom, numberOfBathrooms, city, price, 
    landSize, propertyType, images}:CreateHomeDto, userId:number){
    const home = await this.prisma.home.create({
      data:{
        address,
        number_of_bedroom:numberOfBedroom,
        number_of_bathrooms:numberOfBathrooms,
        city,
        price,
        land_size:landSize,
        propertyType,
        realtor_id: userId,
      }
    })

    const homeImages = images.map(image => {
      return {...image,home_id:home.id}
    })

    await this.prisma.image.createMany({data:homeImages})

    return new HomeResponseDto(home)
  }

    async updateHomeById(id:number, data:UpdateHomeDto){
    const updatedHome = await this.prisma.home.update({
      where: {
        id,
      },
      data: {
        ...data,
        images: {
          createMany: { data: data.images }
        }
      },
    });
    return new HomeResponseDto(updatedHome)
    }
    



  async deleteHomeById(id:number){
    await this.getHomeById(id)

    await this.prisma.image.deleteMany({
      where:{
        home_id:id
      }
    });

    await this.prisma.home.delete({
      where:{
        id
      }
    });
  }

  async getRealtorByHomeId(id:number){
    const home = await this.prisma.home.findUnique({
      where:{
        id
      },
      select:{
        realtor:{
          select:{
            name:true,
            id:true,
            email:true,
            phone:true
          }
        }
      }
    })

    if(!home){
      throw new NotFoundException(`Home #${id} not found`)
    }

    return home.realtor
  }


  async inquire(buyer:UserInfo,homeId:number,message){
    const realtor = await this.getRealtorByHomeId(homeId);

    return await this.prisma.message.create({
      data:{
        realtor_id:realtor.id,
        buyer_id:buyer.id,
        home_id:homeId,
        message
      } 
    })
  }

  getMessagesByHome(homeId:number){
    return this.prisma.message.findMany({
      where:{
        home_id:homeId
      },
      select:{
        message:true,
        buyer:{
          select:{
            name:true,
            phone:true,
            email:true
          }
        }
      }
    })
  }
}
