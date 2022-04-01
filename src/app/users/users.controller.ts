import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Headers,
    UseGuards,
    Inject,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { AuthService } from '../../common/auth/auth.service';
import { AuthGuard } from '../../auth.guard';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggerService, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
export class UsersController {
    constructor(
        //private usersService: UsersService, //private authService: AuthService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;

        //await this.usersService.createUser(name, email, password);

        const command = new CreateUserCommand(name, email, password);
        return this.commandBus.execute(command);
    }

    /*
    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;

        return await this.usersService.verifyEmail(signupVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        //this.printWinstonLog(dto);
        const { email, password } = dto;

        return await this.usersService.login(email, password);
    }
     */

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getUserInfo(
        @Headers() headers: any,
        @Param('id') userId: string,
    ): Promise<UserInfo> {
        //const jwtString = headers.authorization.split('Bearer ')[1];
        //this.authService.verify(jwtString);
        //return await this.usersService.getUserInfo(userId);
        const command = new GetUserInfoQuery(userId);
        return this.queryBus.execute(command);
    }

    /*
    private printWinstonLog(dto) {
        console.log(dto);

        this.logger.error('error: ', dto);
        this.logger.warn('warn: ', dto);
        this.logger.info('info: ', dto);
        this.logger.http('http: ', dto);
        this.logger.verbose('verbose: ', dto);
        this.logger.debug('debug: ', dto);
        this.logger.silly('silly: ', dto);
    }
*/

    private printLoggerServiceLog(dto) {
        try {
            throw new InternalServerErrorException('test');
        } catch (e) {
            this.logger.error('error: ' + JSON.stringify(dto), e.stack);
        }
        this.logger.warn('warn: ' + JSON.stringify(dto));
        this.logger.verbose('verbose: ' + JSON.stringify(dto));
        this.logger.debug('debug: ' + JSON.stringify(dto));
    }
}
