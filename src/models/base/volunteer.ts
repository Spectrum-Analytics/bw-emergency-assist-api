// Import the Firestore GeoPoint type as appropriate for your project
// For example, with Firebase Web SDK:
// import { GeoPoint } from "firebase/firestore";
import * as admin from 'firebase-admin'

export interface Volunteer {
    /** Unique identifier for each reported emergency situation */
    volunteerId: string;

    /** Current state of the volunteer */
    status?: string;

    /** URL or path to a photo/video capturing the flood damage */
    media?: string;

    createdAt?: FirebaseFirestore.FieldValue;
    updatedAt?: FirebaseFirestore.FieldValue;
    

    /** Additional information or updates about the incident */
    notes?: string;
}