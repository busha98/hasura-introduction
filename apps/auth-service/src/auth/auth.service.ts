import { Injectable, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersServiceConfiguration } from '../configuration.module';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User } from '@app/shared/entities/User/User';
import { Role } from '@app/shared/entities/Role/Role';

const getRandomString = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return value;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly config: ConfigService<UsersServiceConfiguration>
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne(
      { email },
      { select: ['salt', 'password', 'email'] }
    );

    if (!user) {
      return null;
    }

    const hashedPassword = sha512(
      sha512(password, this.config.get('system').globalSalt),
      user.salt
    );

    if (user.password === hashedPassword) {
      const { password, salt, ...result } = user;
      return result;
    }

    return null;
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findOne({ email: data.email }, { relations: ['roles'] });

    console.dir({ user }, { depth: 100 });

    const payload = {
      email: user.email,
      roles: user.roles,
      "https://hasura.io/jwt/claims": {
        'x-hasura-default-role': user.roles[0]['value'],
        'x-hasura-allowed-roles': user.roles.map(r => r.value),
        "x-hasura-user-id": user.id.toString(),
      },
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(data: RegistrationDto) {
    const salt = getRandomString(32);

    const password = sha512(sha512(data.password, this.config.get('system').globalSalt), salt);

    const user = await this.userRepository.findOne({ email: data.email });
    if (user) {
      throw new HttpException('user already exists.', HttpStatus.BAD_REQUEST);
    }

    const roles = await this.roleRepository.find({ id: In(data.roleIds) });
    if (roles.length < data.roleIds.length) {
      const roleIds = roles.map(r => r.id);
      const notFoundRoleIds = data.roleIds.filter(id => !roleIds.includes(id));
      throw new NotFoundException(`role with id=${notFoundRoleIds.join(',')} not found`);
    }

    const savedUser = await this.userRepository.save({
      email: data.email,
      password: password,
      salt: salt,
      roles: roles
    });

    const payload = {
      email: savedUser.email,
      roles: savedUser.roles,
      "https://hasura.io/jwt/claims": {
        'x-hasura-default-role': savedUser.roles[0]['value'],
        'x-hasura-allowed-roles': savedUser.roles.map(r => r.value),
        "x-hasura-user-id": savedUser.id.toString(),
      },
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(jwtPayload) {
    const user = await this.userRepository.findOne({ email: jwtPayload.email });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return { user };
  }
}
