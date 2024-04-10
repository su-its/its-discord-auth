import * as admin from 'firebase-admin';
import serviceAccount from '../../its-discord-auth-firebase-adminsdk-wn2uo-ac781d8325.json';

export function initializeFirestore(): admin.firestore.Firestore {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });

    const db: admin.firestore.Firestore = admin.firestore();
    return db;
};

export default initializeFirestore;