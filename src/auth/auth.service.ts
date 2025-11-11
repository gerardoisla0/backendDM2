import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    
    const userExists = await this.findPerEmail(createAuthDto.email);
    if(!userExists){
        const userRegister = await this.userRepository.create({
          email: createAuthDto.email,
          fullName: createAuthDto.fullName,
          firebaseUuid: createAuthDto.firebaseUuid,
        }); 
      await this.userRepository.save(userRegister);
      return {
        email: userRegister.email,
        fullName: userRegister.fullName,
        id: userRegister.id
      };
    }else{
      throw new BadRequestException(
        {
          message: 'El correo electrónico ya está registrado',
          exists: true
        }
      )
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if(user){
      return user;
    }else{
      throw new BadRequestException(
        {
          message: 'Usuario no encontrado',
          exists: false
        }
      )
    }
  }

  async findPerEmail(email: string) {
      const user = await this.userRepository.findOne({
        where: { email }
      });
      return !!user;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
  
    const user = await this.userRepository.findOne ({
      where: { id}
    })

    if(!user){
      throw new NotFoundException(`El usuario con id ${id} no fue encontrado.`);
    }

    user.email = updateAuthDto.email || user.email;

    await this.userRepository.save(user);

    return user;

  }

  async remove(id: string) {
    
    const user = await this.userRepository.findOne ({
      where: { id}
    })

    if(!user){
      throw new NotFoundException(`El usuario con id ${id} no fue encontrado.`);

    }

    await this.userRepository.remove(user);

    return { message: `Usuario con id ${id} eliminado correctamente.` };
  }
}
