import { Incident } from "./incident";
import { Fault } from "./fault";
import { Volunteer } from "./volunteer";

  
  export interface Person {
    id: string
    /** First name of the person affected or reporting the incident */
    firstName: string;
  
    /** Last name of the person affected or reporting the incident */
    lastName: string;
  
    /** Whether this is a person involved in an incident, or is reporting a fault, or is registering to be a volunteer  */
    type: string;
  
    /** Array of Incident objects representing multiple help requests */
    incidents: Incident[];

    /** Array of Faults objects representing multiple fault requests */
    faults: Fault[];

    /** Array of Faults objects representing multiple fault requests */
    volunteer: Volunteer;

    createdAt?: FirebaseFirestore.FieldValue;
    updatedAt?: FirebaseFirestore.FieldValue;
  }