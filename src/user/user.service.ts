import { HttpException, Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDTO } from './DTO/user.create.dto';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
    private logger:Logger = new Logger(UserService.name);
    constructor(
        private redisService:RedisService, 
        private prismaService:PrismaService){};

    private async verifyEmail(email:string):Promise<User>{
        const userEmail:User = await this.prismaService.user.findUnique({
            where:{
                email:email
            }
        });

        return userEmail
    };

    public async createUser(data:CreateUserDTO):Promise<User>{
        try{
            
            const tryToVerifyEmail = await this.verifyEmail(data.email);

            if(tryToVerifyEmail){
                this.logger.error(`This email(${data.email}) is already been used!`);
                throw new HttpException(`This email(${data.email}) is already been used!`, 401)
            };

            const createUser = await this.prismaService.user.create({
                data:data,
            });

            return createUser

        }catch(err){
            this.logger.error(`Error to create the user! \n Details: ${err}`);
            throw new HttpException(`Error to create the user! \n Details: ${err}`,500)
        };
    };

    public async getAllUsers():Promise<User[]>{
        try{
            const showAllUsersInCache = await this.redisService.get("users");

            if(!showAllUsersInCache){
                const showAllUsersfromDB = await this.prismaService.user.findMany();

                const addUsersToCache = await this.redisService.set(
                "user",
                JSON.stringify(showAllUsersInCache),
                "EX",
                300
                );

                if(!addUsersToCache){
                    this.logger.error(`Error to set the users in the cache!`);
                    throw new HttpException(`Error to set the users in the cache!`,403)
                };

                return showAllUsersfromDB;
            };

        }catch(err){
            this.logger.error(`Error to create the user! \n Details: ${err}`);
            throw new HttpException(`Error to create the user! \n Details: ${err}`,500)
        };
    };
};

