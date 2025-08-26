import {
  Controller,
  Post,
  Body,
  Res,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserInputDto } from './dto/login-user.input.dto';
import { SignUpUserInputDto } from './dto/signup-user.input.dto';
import { LoginResponseDto } from './dto/login-user.response.dto';
import { COOKIE_NAME } from 'src/utils/constants';
import { Response } from 'express';
import { Public } from 'src/decorators/is.public';

@ApiTags('Auth')
@ApiExtraModels(LoginResponseDto)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpUserInputDto })
  @ApiResponse({
    status: 200,
    description:
      'User successfully registered. Sets refreshToken in HttpOnly cookies and returns accessToken with user info in response body.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async signupUser(
    @Body() createAuthDto: SignUpUserInputDto,
    @Res() res: Response,
  ) {
    try {
      const createdUser = await this.authService.signUpUser(createAuthDto);

      res.cookie(COOKIE_NAME, createdUser.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({
        accessToken: createdUser.accessToken.token,
        user: {
          name: createdUser.name,
          email: createdUser.email,
        },
      });
    } catch (e) {
      this.logger.debug('Incorrect password', e);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return JWT tokens' })
  @ApiBody({ type: LoginUserInputDto })
  @ApiResponse({
    status: 200,
    description:
      'User successfully logged in. Sets refreshToken in HttpOnly cookies and returns accessToken with user info in response body.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginUser(
    @Body() createAuthDto: LoginUserInputDto,
    @Res() res: Response,
  ) {
    try {
      const loginResponse = await this.authService.loginUser(createAuthDto);

      res.cookie(COOKIE_NAME, loginResponse.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({
        accessToken: loginResponse.accessToken.token,
        user: {
          name: loginResponse.name,
          email: loginResponse.email,
        },
      });
    } catch (e) {
      this.logger.debug('Incorrect password', e);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
