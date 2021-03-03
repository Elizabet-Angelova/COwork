import { UnauthorizedException, Injectable } from "@nestjs/common";
import { JWTPayload } from '../DTOs/jwt-payload'
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { Token } from "src/Entities/token.entity";
import { User } from "src/Entities/user.entity";
import { UserRole } from "src/Enums/user-role";


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,

  ) { }

  async findUserByName(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username,
        isDeleted: false,
      }
    });
  }

  async findUserByEmail(email: string): Promise<User> {
      return await this.userRepository.findOne({
      where: {
        email,
        isDeleted: false,
      }
    });
  }

  async blacklist(token: string) {
    const tokenEntity = this.tokenRepository.create();
    tokenEntity.token = token;

    await this.tokenRepository.save(tokenEntity)
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return Boolean(await this.tokenRepository.findOne({
      where: {
        token,
      }
    }));
  }
  
  async validateUser(username: string, password: string): Promise<User> | null {
    const user = await this.findUserByName(username);
    if (!user) {
      return null;
    }
    const isUserValidated = await bcrypt.compare(password, user.password);
    return isUserValidated
      ? user
      : null;
  }

  async validateUserEmail(email: string, password: string): Promise<User> | null {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isUserValidated = await bcrypt.compare(password, user.password);
    return isUserValidated
      ? user
      : null;
  }

  async login(emailOrUsernsme: string, password: string) {
    let user = await this.validateUserEmail(emailOrUsernsme, password);
    if (!user) {
      user = await this.validateUser(emailOrUsernsme, password)
    }
    if (!user) {
      throw new UnauthorizedException(`Wrong credentials!`);
    }

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: UserRole[user.role],
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

}