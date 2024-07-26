import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase.config';
import { FirebaseStorageService } from './firebase.service';

// Create a global module to enforce singleton behavior
@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
        }),
    ],
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: () => {
                // Check if Firebase Admin SDK is already initialized
                if (!admin.apps.length) {
                    admin.initializeApp(firebaseConfig);
                }
                return admin;
            },
        },
        FirebaseStorageService,
    ],
    exports: [FirebaseStorageService, 'FIREBASE_ADMIN'],
})
export class FirebaseModule { }
