import * as admin from 'firebase-admin'; 
import { GeoPoint } from 'firebase-admin/firestore';
import { Person } from '../../models/base/person';
import { Volunteer } from '../../models/base/volunteer';

// Import your TypeScript models for Person, Incident, and EmergencyContact
// import { Person, Incident, EmergencyContact } from '../../models/emergency';

// For example, if using Firebase Web SDK types, you might import GeoPoint like this:
// import { GeoPoint } from 'firebase/firestore';

export class JointEffortsService {
    private volunteerCollection: admin.firestore.CollectionReference;
    private personsCollection: admin.firestore.CollectionReference;
 

    constructor(private db: admin.firestore.Firestore) {
        // Collection where each person document holds the person's details and their volunteer status.
        this.volunteerCollection = db.collection('volunteer'); 
    }
    
    public async createNewVolunteer(personId: string, volunteer: Partial<Volunteer>): Promise<Volunteer> {
        const volunteerId = this.volunteerCollection.doc().id;
    
        const newVolunteer : Volunteer  = {
            volunteerId,
            ...volunteer,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await this.volunteerCollection.doc(volunteerId).set(newVolunteer);

        // Add to the person's incidents array
        await this.personsCollection.doc(personId).update({
            incidents: admin.firestore.FieldValue.arrayUnion(newVolunteer), // Append new incident
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return newVolunteer;
    }

    /**
     * Retrieve an Volnteer by its ID.
     */
    public async getVolunteerById(volunteerId: string): Promise<Volunteer> {
        const doc = await this.volunteerCollection.doc(volunteerId).get();
        if (!doc.exists) {
            throw new Error('Volunteer not found');
        }
        return { volunteerId: doc.id, ...doc.data() } as Volunteer;
    }

    /**
     * Update an existing Volnteer.
     */
    public async updateVolunteer(
        volunteerId: string,
        updates: Partial<Volunteer>
        ): Promise<Volunteer> {
        const volunteerRef = this.volunteerCollection.doc(volunteerId);
        await volunteerRef.update({
            ...updates,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return this.getVolunteerById(volunteerId);
    }

    /**
     * Delete an incident.
     */
    public async deleteIncident(volunteerId: string): Promise<void> {
        await this.volunteerCollection.doc(volunteerId).delete();
    }

    

    /**
     * List all incidents for a given person.
     */
    public async listIncidents(personId: string): Promise<any[]> {
        const personDoc = await this.personsCollection.doc(personId).get();
        if (!personDoc.exists) {
            throw new Error('Person not found');
        }
        const personData = personDoc.data();
        return personData?.incidents || [];
    }
}
