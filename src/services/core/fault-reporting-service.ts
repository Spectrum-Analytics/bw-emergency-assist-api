import * as admin from 'firebase-admin'; 
import { EmergencyContact } from '../../models/base/emergency-contact';
import { GeoPoint } from 'firebase-admin/firestore';
import { Person } from '../../models/base/person';
import { Fault } from '../../models/base/fault';

// Import your TypeScript models for Person, Incident, and EmergencyContact
// import { Person, Incident, EmergencyContact } from '../../models/emergency';

// For example, if using Firebase Web SDK types, you might import GeoPoint like this:
// import { GeoPoint } from 'firebase/firestore';

export class JointEffortsService {
    private faultsCollection: admin.firestore.CollectionReference; 
    private personsCollection: admin.firestore.CollectionReference;
    

    constructor(private db: admin.firestore.Firestore) {
        // Collection for emergency contacts.
        this.faultsCollection = db.collection('faults'); 
    }
    
    /** Create a new fault */
    public async createFault(fault: Partial<Fault>): Promise<Fault> {
        const faultId = this.faultsCollection.doc().id;
        fault.faultId = faultId;
        await this.faultsCollection.doc(faultId).set({
            ...fault,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { faultId, ...fault } as Fault;
    }

    /**
     * Retrieve a fault by its ID.
     */
    public async getFaultById(faultId: string): Promise<Fault> {
        const doc = await this.faultsCollection.doc(faultId).get();
        if (!doc.exists) {
            throw new Error('Fault not found');
        }
        return { faultId: doc.id, ...doc.data() } as Fault;
    }

    /**
     * Update an existing incident.
     */
    public async updateFault(
        faultId: string,
        updates: Partial<Fault>
        ): Promise<Fault> {
        const faultRef = this.faultsCollection.doc(faultId);
        await faultRef.update({
            ...updates,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return this.getFaultById(faultId);
    }

    /**
     * Delete an incident.
     */
    public async deleteFault(faultId: string): Promise<void> {
        await this.faultsCollection.doc(faultId).delete();
    }

    /**
     * List all incidents for a given person.
     */
    public async listFaults(personId: string): Promise<any[]> {
        const personDoc = await this.personsCollection.doc(personId).get();
        if (!personDoc.exists) {
            throw new Error('Person not found');
        }
        const personData = personDoc.data();
        return personData?.faults || [];
    }

}
