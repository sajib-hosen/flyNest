import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { SignUpUserInputDto } from './dto/signup-user.input.dto';
import { LoginUserInputDto } from './dto/login-user.input.dto';
import { AdminRolePower, AdminRoleType } from './dto/admin.role.type';
import { JwtService } from '@nestjs/jwt';
import { AuthInfo } from './dto/auth.info';
import { appConfig } from 'src/configuration';
import { ConfigType } from '@nestjs/config';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { users } from 'src/drizzle/schema/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,

    @Inject(DRIZZLE) private db: DrizzleDB,

    private jwtService: JwtService,
  ) {}

  async createRefreshToken(userId: number, email: string) {
    return await this.jwtService.signAsync(
      {
        userId,
        email,
        tokenType: 'refresh',
      },
      {
        algorithm: 'RS256',
        privateKey: this.config.jwt.privateKey,
        expiresIn: this.config.jwt.jwt_refresh_expires,
      },
    );
  }

  async createAccessToken(authInfo: AuthInfo) {
    const data = {
      userId: authInfo.userId,
      email: authInfo.email,
    };
    return {
      data,
      token: await this.jwtService.signAsync(data, {
        algorithm: 'RS256',
        privateKey: this.config.jwt.privateKey,
        expiresIn: this.config.jwt.jwt_access_expires,
      }),
    };
  }

  // -------------------- Sign Up --------------------
  async signUpUser(input: SignUpUserInputDto) {
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, input.name));

    if (existingUser.length > 0) {
      throw new BadRequestException('Email already registered');
    }

    // Hash the password
    const hashedPassword = await hash(input.password, 10);

    // Insert new user
    const [newUser] = await this.db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash: hashedPassword,
        role: 'student',
      })
      .returning();

    const refreshToken = await this.createRefreshToken(
      newUser.id,
      newUser.email,
    );
    const accessToken = await this.createAccessToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      refreshToken,
      accessToken,
    };
  }

  // -------------------- Login --------------------
  async loginUser(input: LoginUserInputDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, input.email));

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Compare password
    const isPasswordValid = await compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = await this.createRefreshToken(user.id, user.email);
    const accessToken = await this.createAccessToken({
      userId: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      refreshToken,
      accessToken,
    };
  }

  // -------------------- Check Admin Role --------------------
  async hasSufficientAdminRole(email: string, roles: AdminRoleType[]) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) return false;

    const hasRole = roles.some(
      (role) =>
        AdminRolePower[user.role as AdminRoleType] >= AdminRolePower[role],
    );

    return hasRole;
  }
}
