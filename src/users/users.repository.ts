import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-roles.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, cpf, senha } = createUserDto;

    const user = this.create();
    user.email = email;
    user.cpf = cpf;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.senha = await this.hashPassword(senha, user.salt);
    try {
      console.log(
        'Valores = ' + user.email + ' ' + user.senha + ' ' + user.cpf + '',
      );
      await user.save();
      delete user.senha;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, senha } = credentialsDto;
    const user = await this.findOne({ email, status: true });

    if (user && (await user.checkPassword(senha))) {
      return user;
    } else {
      return null;
    }
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, cpf, status, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.status = :status', { status });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (cpf) {
      query.andWhere('user.cpf ILIKE :cpf', { cpf: `%${cpf}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.cpf', 'user.email', 'user.role', 'user.status']);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }
}
