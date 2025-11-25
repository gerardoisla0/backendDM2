import { IsNumber, IsString } from "class-validator";

export class MessageNotificationDto {
    @IsString()
    message: string;

    @IsString()
    fullName: string;
}
