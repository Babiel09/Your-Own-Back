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

    private async findUserById(id:string):Promise<User>{
        const findUser = await this.prismaService.user.findUnique({
            where:{
                id:id
            }
        });

        return findUser;
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

    public async findSpecifiedUser(userWantedId:string,data:{name:string,email:string,photo:string,password:string,bio:string}):Promise<User>{
        try{

            const findUserById = await this.findUserById(userWantedId);

        if(!findUserById){
            this.logger.error(`Error to find the user!`);
            throw new HttpException(`Error to find the user!`,404);
        };

            const changeUserSpecs = await this.prismaService.user.update({
                where:{
                    id:findUserById.id
                },
                data:data
            });

            return changeUserSpecs;

        }catch(err){
            this.logger.error(`Error to update the user! \n Details: ${err}`);
            throw new HttpException(`Error to update the user! \n Details: ${err}`,500);
        };
    };

    public async deleteUser(userWantedId:string):Promise<User>{
        try{
            
            const findUserToDelete = await this.findUserById(userWantedId);

            if(!findUserToDelete){
            this.logger.error(`Error to find the user!`);
            throw new HttpException(`Error to find the user!`,404);
            };

            const userDead = await this.prismaService.user.delete({
                where:{
                    id:findUserToDelete.id
                }
            });

            return userDead;

        }catch(err){
            this.logger.error(`Error to update the user! \n Details: ${err}`);
            throw new HttpException(`Error to update the user! \n Details: ${err}`,500);
        };
    }
};

