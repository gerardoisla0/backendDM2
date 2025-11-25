import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { MessageNotificationDto } from './dto/send-notificacion.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly firebaseService: FirebaseService
  ){}
  
  async send(createNotificationDto: CreateNotificationDto) {
    const payload = {
      notification: {
        title: createNotificationDto.title,
        body: createNotificationDto.message,
      }
    }
    try{
      await this.firebaseService.sendNotification(createNotificationDto.token, payload);
    }catch(error){
      console.error('Error sending notification:', error);
    }
  }

  async sendMessage(messageNotificationDto: MessageNotificationDto){
    return this.firebaseService.sendMessage(messageNotificationDto);
  }

  async sendMessageRT(messageNotificationDto: MessageNotificationDto){
    return this.firebaseService.sendMessageRT(messageNotificationDto);
  }
}
