import * as admin from 'firebase-admin'; 
import { EmergencyContact } from '../../models/base/emergency-contact';
import { GeoPoint } from 'firebase-admin/firestore';
import { Person } from '../../models/base/person';

// Import your TypeScript models for Person, Incident, and EmergencyContact
// import { Person, Incident, EmergencyContact } from '../../models/emergency';

// For example, if using Firebase Web SDK types, you might import GeoPoint like this:
// import { GeoPoint } from 'firebase/firestore';

export class EmergencyService {
    private contactsRef: admin.database.Reference;

  private personsCollection: admin.firestore.CollectionReference;
  private contactsCollection: admin.firestore.CollectionReference;
 

  constructor(private db: admin.firestore.Firestore) {
    // Collection where each person document holds the person's details and their incidents.
    this.personsCollection = db.collection('people');
    // Collection for emergency contacts.
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
