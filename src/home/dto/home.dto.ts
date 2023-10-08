import { PropertyType } from "@prisma/client";
import { Exclude,Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

export class HomeResponseDto {
  id:number;
  address: string;
  
  @Exclude()
  number_of_bedroom: number;

  @Expose({name:"numberOfBedroom"})
  numberOfBedroom(){
    return this.number_of_bathrooms
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({name:"numberOfBathrooms"})
  numberOfBathrooms(){
    return this.number_of_bathrooms
  }

  city: string;

  @Exclude()
  listed_date: Date;

  @Expose({name:"listedDate"})
  listedDate(){
    return this.listed_date
  }

  
  price: number;

  image:string

  @Exclude()
  land_size: number;

  @Expose({name:"landSize"})
  landSize(){
    return this.land_size
  }

  
  propertyType: PropertyType;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial:Partial<HomeResponseDto>){
    Object.assign(this,partial)
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address:string

  @IsNumber()
  @IsPositive()
  numberOfBedroom: number

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number

  @IsString()
  @IsNotEmpty()
  city: string

  @IsNumber()
  @IsPositive()
  price: number

  @IsNumber()
  @IsPositive()
  landSize: number

  @IsEnum(PropertyType)
  propertyType: PropertyType

  @IsArray()
  @ValidateNested({each:true})
  @Type(()=>Image)
  images: Image[]
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedroom?: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType

}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  message:string
}


export class IdParamDto {
  @IsInt()
  id: number;
}