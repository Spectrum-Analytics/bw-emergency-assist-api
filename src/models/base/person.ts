import { Incident } from "./incident";

  
  export interface Person {
    id: string
    /** First name of the person affected or reporting the incident */
    firstName: string;
  
    /** Last name of the person affected or reporting the incident */
    lastName: string;
  
    
  
    /** Array of Incident objects representing multiple help requests */
    incidents: Incident[];

    createdAt?: FirebaseFirestore.FieldValue;
    updatedAt?: FirebaseFirestore.FieldValue;
  }