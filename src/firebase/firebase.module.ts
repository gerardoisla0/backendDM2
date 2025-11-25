import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin'

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService]
})
export class FirebaseModule {
  constructor(){
      let serviceAccount = require("../../dm2-2025-63d43-firebase-adminsdk-fbsvc-10bd589833.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
  }
}
