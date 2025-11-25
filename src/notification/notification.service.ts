import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

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

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
