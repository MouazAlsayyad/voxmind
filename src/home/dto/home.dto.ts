import { PropertyType } from "@prisma/client";
import { Exclude,Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber,  IsOptional,  IsPositive, IsString, ValidateNested } from "class-validator";
import { ApiProperty ,PartialType} from "@nestjs/swagger";

export class HomeResponseDto {
  @ApiProperty()
  id:number;
  address: string;
  
  @Exclude()
  number_of_bedroom: number;

  @ApiProperty()
  @Expose({name:"numberOfBedroom"})
  numberOfBedroom(){
    return this.number_of_bathrooms
  }

  @Exclude()
  number_of_bathrooms: number;

  @ApiProperty()
  @Expose({name:"numberOfBathrooms"})
  numberOfBathrooms(){
    return this.number_of_bathrooms
  }

  @ApiProperty()
  city: string;

  @Exclude()
  listed_date: Date;

  @ApiProperty()
  @Expose({name:"listedDate"})
  listedDate(){
    return this.listed_date
  }

  @ApiProperty()
  price: number;

  @ApiProperty()
  image:string

  @Exclude()
  land_size: number;

  @Expose({name:"landSize"})
  landSize(){
    return this.land_size
  }

  @ApiProperty()
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

export class HomeFilterDto {
  @ApiProperty({ required: false }) // Make it optional
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false }) // Make it optional
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false }) // Make it optional
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ required: false }) // Make it optional
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string
}

export class CreateHomeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address:string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  numberOfBedroom: number

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  landSize: number

  @ApiProperty()
  @IsEnum(PropertyType)
  propertyType: PropertyType

  @ApiProperty()
  @IsArray()
  @ValidateNested({each:true})
  @Type(()=>Image)
  images: Image[]
}

export class UpdateHomeDto extends PartialType(CreateHomeDto){}

export class InquireDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message:string
}


export class IdParamDto {
  @IsInt()
  id: number;
}