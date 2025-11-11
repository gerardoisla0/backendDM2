import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3, {
        message: 'El Nombre Completo es muy corto (mínimo 3 caracteres)' 
    })
    @MaxLength(100)
    fullName: string;
    
    @IsString()
    firebaseUuid: string;

}
