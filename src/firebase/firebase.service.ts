import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import * as admin from 'firebase-admin';
import { MessageNotificationDto } from 'src/notification/dto/send-notificacion.dto';

@Injectable()
export class FirebaseService {

    async create(createAuthDto: CreateAuthDto): Promise<admin.auth.UserRecord>{
        try{
            const userRecord = await admin.auth().createUser({
                email: createAuthDto.email,
                password: createAuthDto.password,
            });
            console.log(userRecord);
            return userRecord;
        }catch(error){
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async verify(token: string): Promise<any>{
        try{
            console.log("Verifying token:", token);
            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log("Decoded Token:", decodedToken);
            return decodedToken;
        }catch(error){
            console.log(error);
        }
    }

    async sendNotification(token: string, payload: any){
        try{
            //FCM - FIREBASE CLOUD MESSAGING
            await admin.messaging().send({
                token: token,
                notification: payload.notification
            })
        }catch(error){
            console.log(error);
        }

    }

    async sendMessage(messageNotificationDto: MessageNotificationDto){
        try{

            const newMessage = {
                fullName: messageNotificationDto.fullName,
                message: messageNotificationDto.message,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            }

            const docRef = await admin.firestore().collection('messages').add(newMessage);

            return { status: 'success', doc: docRef };

        }catch(error){
            console.log(error);
        }
    }

    async sendMessageRT(messageNotificationDto: MessageNotificationDto){
        try{

            const newMessage = {
                fullName: messageNotificationDto.fullName,
                message: messageNotificationDto.message,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            }

            const messageRef = admin.database().ref('messages').push();
            await messageRef.set(newMessage);

            return { status: 'success' };

        }catch(error){
            console.log(error);
        }
    }
}
