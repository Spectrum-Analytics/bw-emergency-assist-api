import * as admin from 'firebase-admin'; 
import { EmergencyContact } from '../../models/base/emergency-contact';
import { Incident } from '../../models/base/incident'; 
import { GeoPoint } from 'firebase-admin/firestore';
import { Person } from '../../models/base/person';

// Import your TypeScript models for Person, Incident, and EmergencyContact
// import { Person, Incident, EmergencyContact } from '../../models/emergency';

// For example, if using Firebase Web SDK types, you might import GeoPoint like this:
// import { GeoPoint } from 'firebase/firestore';

export class EmergencyService {
    private incidentsCollection: admin.firestore.CollectionReference;
    private contactsRef: admin.database.Reference;

  private personsCollection: admin.firestore.CollectionReference;
  private contactsCollection: admin.firestore.CollectionReference;
 

  constructor(private db: admin.firestore.Firestore) {
    // Collection where each person document holds the person's details and their incidents.
    this.personsCollection = db.collection('people');
    // Collection for emergency contacts.
    this.incidentsCollection = db.collection('incidents'); 
    this.contactsCollection = db.collection('emergencyContacts');
  }

  /**
   * Get a person by phone number.
   */
  public async getPersonByPhone(phone: string): Promise<Person | null> {
    const querySnapshot = await this.personsCollection
      .where('id', '==', phone)
      .limit(1)
      .get();
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Person;
    }
    return null;
  }
  /**
   * Create a new person.
   */
  public async createPerson(personData: Omit<Person,  'createdAt' | 'updatedAt'>): Promise<Person> {
    const personRef = this.personsCollection.doc();
    const newPerson: Person = {
      id: personData.id,
      ...personData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await personRef.set(newPerson);
    return newPerson;
  }

  public async createIncident(incident: Partial<Incident>): Promise<Incident> {
    const incidentId = this.incidentsCollection.doc().id;
    incident.incidentId = incidentId;
    await this.incidentsCollection.doc(incidentId).set({
      ...incident,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { incidentId, ...incident } as Incident;
  }

  /**
   * Retrieve an incident by its ID.
   */
  public async getIncidentById(incidentId: string): Promise<Incident> {
    const doc = await this.incidentsCollection.doc(incidentId).get();
    if (!doc.exists) {
      throw new Error('Incident not found');
    }
    return { incidentId: doc.id, ...doc.data() } as Incident;
  }

  /**
   * Update an existing incident.
   */
  public async updateIncident(
    incidentId: string,
    updates: Partial<Incident>
  ): Promise<Incident> {
    const incidentRef = this.incidentsCollection.doc(incidentId);
    await incidentRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return this.getIncidentById(incidentId);
  }

  /**
   * Delete an incident.
   */
  public async deleteIncident(incidentId: string): Promise<void> {
    await this.incidentsCollection.doc(incidentId).delete();
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

  /**
   * Create a new emergency contact.
   */
  public async createEmergencyContact(contact: Partial<any>) {
    // Generate a unique contact ID.
    const contactId = this.contactsCollection.doc().id;
    contact.contactId = contactId;
    await this.contactsCollection.doc(contactId).set({
      ...contact,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return contact;
  }

  /**
   * Get an emergency contact by ID.
   */
  public async getEmergencyContactById(contactId: string): Promise<any> {
    const doc = await this.contactsCollection.doc(contactId).get();
    if (!doc.exists) {
      throw new Error('Emergency contact not found');
    }
    return { contactId: doc.id, ...doc.data() };
  }

  /**
   * Update an emergency contact.
   */
  public async updateEmergencyContact(contactId: string, updates: Partial<any>) {
    const contactRef = this.contactsCollection.doc(contactId);
    await contactRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return this.getEmergencyContactById(contactId);
  }

  /**
   * Delete an emergency contact.
   */
  public async deleteEmergencyContact(contactId: string): Promise<void> {
    await this.contactsCollection.doc(contactId).delete();
  }

  /**
   * List emergency contacts with optional pagination.
   * In a real implementation, you might add additional filters (e.g., by proximity using GeoPoint).
   */
  public async listEmergencyContacts(limit: number, startAfter?: string): Promise<any[]> {
    let query: admin.firestore.Query = this.contactsCollection.orderBy('createdAt').limit(limit);

    if (startAfter) {
      const snapshot = await this.contactsCollection.doc(startAfter).get();
      if (snapshot.exists) {
        query = query.startAfter(snapshot);
      }
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ contactId: doc.id, ...doc.data() }));
  }
 
 


}
