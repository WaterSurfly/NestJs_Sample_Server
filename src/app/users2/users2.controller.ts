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
import { Users2Service } from './users2.service';
import { AuthService } from '../../common/auth/auth.service';
import { AuthGuard } from '../../auth.guard';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggerService, Logger } from '@nestjs/common';

@Controller('users2')
export class Users2Controller {
    constructor(
        private usersService: Users2Service, //private authService: AuthService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    @Get('/greeting')
    async getHello() {
        return this.usersService.getHello();
    }

    @Get('/greeting-async')
    async getHelloAsync() {
        return this.usersService.getHelloAsync();
    }

    @Get('/publish-event')
    async publishEvent() {
        this.usersService.publishEvent();
    }

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;

        await this.usersService.createUser(name, email, password);
    }

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

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getUserInfo(
        @Headers() headers: any,
        @Param('id') userId: string,
    ): Promise<UserInfo> {
        //const jwtString = headers.authorization.split('Bearer ')[1];
        //this.authService.verify(jwtString);
        return await this.usersService.getUserInfo(userId);
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
