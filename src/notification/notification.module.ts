import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [FirebaseModule]
})
export class NotificationModule {}
