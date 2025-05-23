import { Injectable } from "@nestjs/common";
import { IsEmail, IsInt, IsString, MaxLength, MinLength } from "class-validator";

@Injectable()
export class CreateUserDTO{
    
    @IsString({message:"The name must be a string!"})
    name:string;

    @IsEmail(undefined,{message:"The email needs to follow this standart: youremail@yourprovider.com"})
    email:string;

    @IsString({message:"The password must be a string!"})
    @MinLength(12,{message:"The password needs to have 8 caractheres to be accept"})
    password:string;

    @IsString({message:"The bio must be a string!"})
    @MaxLength(12,{message:"The bio only can have 150 caractheres"})
    bio:string;
};