

  
  export interface EmergencyContact {
    /** Unique identifier for the emergency contact */
    contactId: string;
  
    /** Name of the emergency contact */
    name: string;
  
    /** Contact number of the emergency contact */
    phone: string;
  
   
        lat: number;
        lng: number;
  
      geohash?: string;
      coordinates?: [number, number];
      createdAt?: FirebaseFirestore.FieldValue;
      updatedAt?: FirebaseFirestore.FieldValue;
  }
  