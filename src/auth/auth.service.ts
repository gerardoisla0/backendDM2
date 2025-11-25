import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseService: FirebaseService
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    
    const userExists = await this.findPerEmail(createAuthDto.email);
    if(!userExists){
          const { uid } = await this.firebaseService.create(createAuthDto);
          const userRegister = await this.userRepository.create({
            email: createAuthDto.email,
            fullName: createAuthDto.fullName,
            firebaseUuid: uid,
            password: ''
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

  async login(loginAuthDto: LoginAuthDto) {

    //const hashedPassword = await this.hashPassword(loginAuthDto.password);
    const user = await this.userRepository.findOne({
      where: { email: loginAuthDto.email}
    });

    if(user){
      
      const isMatchePassword = await this.comparePassword(loginAuthDto.password, user.password);

      if(!isMatchePassword){
        throw new BadRequestException(
          {
            message: 'Usuario o clave incorrecto',
            exists: false
          }
        )
      }

      return {
        email: user.email,
        fullName: user.fullName,
        id: user.id
      };

    }else{
      throw new BadRequestException(
        {
          message: 'Usuario o clave incorrecto',
          exists: false
        }
      )
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
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
