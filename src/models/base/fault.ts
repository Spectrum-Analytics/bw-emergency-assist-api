// Import the Firestore GeoPoint type as appropriate for your project
// For example, with Firebase Web SDK:
// import { GeoPoint } from "firebase/firestore";
import * as admin from 'firebase-admin'

export interface Fault {
    /** Unique identifier for each reported fault situation */
    faultId: string;

    /** Current state of the fault response */
    overallStatus: string;

    /** Channel used to report the fault (e.g., WhatsApp) */
    reportingChannelUsed: string;

    /** URL or path to a photo/video capturing the flood damage */
    media?: string;

    /** Physical location of the incident as a Firestore GeoPoint */
    lat: number;
    lng: number;
    geohash?: string;

    coordinates?: [number, number];
    createdAt?: FirebaseFirestore.FieldValue;
    updatedAt?: FirebaseFirestore.FieldValue;
    /** Date and time when the fault was first reported */
    reportedDate: Date;

    /** Date when the fault was resolved or closed (optional if still open) */
    resolutionDate?: Date;

    /** Name or ID of the emergency responder assigned to the case */
    personAssigned: string;

    /** Type of help or resources required (e.g., Medical Assistance, Shelter Assistance, etc.) */
    assistanceNeeded: string;

    /** Additional information or updates about the incident */
    notes?: string;
}