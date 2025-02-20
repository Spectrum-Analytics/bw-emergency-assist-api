"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const admin = __importStar(require("firebase-admin"));
// Import your TypeScript models for Person, Incident, and EmergencyContact
// import { Person, Incident, EmergencyContact } from '../../models/emergency';
// For example, if using Firebase Web SDK types, you might import GeoPoint like this:
// import { GeoPoint } from 'firebase/firestore';
class EmergencyService {
    constructor(db) {
        this.db = db;
        // Collection where each person document holds the person's details and their incidents.
        this.personsCollection = db.collection('people');
        // Collection for emergency contacts.
        this.incidentsCollection = db.collection('incidents');
        this.contactsCollection = db.collection('emergencyContacts');
    }
    /**
     * Get a person by phone number.
     */
    async getPersonByPhone(phone) {
        const querySnapshot = await this.personsCollection
            .where('id', '==', phone)
            .limit(1)
            .get();
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    }
    /**
     * Create a new person.
     */
    async createPerson(personData) {
        const personRef = this.personsCollection.doc();
        const newPerson = {
            id: personData.id,
            ...personData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await personRef.set(newPerson);
        return newPerson;
    }
    async createIncident(incident) {
        const incidentId = this.incidentsCollection.doc().id;
        incident.incidentId = incidentId;
        await this.incidentsCollection.doc(incidentId).set({
            ...incident,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { incidentId, ...incident };
    }
    /**
     * Retrieve an incident by its ID.
     */
    async getIncidentById(incidentId) {
        const doc = await this.incidentsCollection.doc(incidentId).get();
        if (!doc.exists) {
            throw new Error('Incident not found');
        }
        return { incidentId: doc.id, ...doc.data() };
    }
    /**
     * Update an existing incident.
     */
    async updateIncident(incidentId, updates) {
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
    async deleteIncident(incidentId) {
        await this.incidentsCollection.doc(incidentId).delete();
    }
    /**
     * List all incidents for a given person.
     */
    async listIncidents(personId) {
        const personDoc = await this.personsCollection.doc(personId).get();
        if (!personDoc.exists) {
            throw new Error('Person not found');
        }
        const personData = personDoc.data();
        return (personData === null || personData === void 0 ? void 0 : personData.incidents) || [];
    }
    /**
     * Create a new emergency contact.
     */
    async createEmergencyContact(contact) {
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
    async getEmergencyContactById(contactId) {
        const doc = await this.contactsCollection.doc(contactId).get();
        if (!doc.exists) {
            throw new Error('Emergency contact not found');
        }
        return { contactId: doc.id, ...doc.data() };
    }
    /**
     * Update an emergency contact.
     */
    async updateEmergencyContact(contactId, updates) {
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
    async deleteEmergencyContact(contactId) {
        await this.contactsCollection.doc(contactId).delete();
    }
    /**
     * List emergency contacts with optional pagination.
     * In a real implementation, you might add additional filters (e.g., by proximity using GeoPoint).
     */
    async listEmergencyContacts(limit, startAfter) {
        let query = this.contactsCollection.orderBy('createdAt').limit(limit);
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
exports.EmergencyService = EmergencyService;
//# sourceMappingURL=emergency-service.js.map