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
        private prismaServiceService:PrismaService){};

    private async verifyEmail(email:string):Promise<User>{
        const userEmail:User = await this.prismaServiceService.user.findUnique({
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

            const createUser = await this.prismaServiceService.user.create({
                data:data,
            });

            return createUser

        }catch(err){
            this.logger.error(`Error to create the user! \n Details: ${err}`);
            throw new HttpException(`Error to create the user! \n Details: ${err}`,409)
        };
    };
};

