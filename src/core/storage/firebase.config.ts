import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();


export const firebaseConfig = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace newline escape characters
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

admin.initializeApp(firebaseConfig);