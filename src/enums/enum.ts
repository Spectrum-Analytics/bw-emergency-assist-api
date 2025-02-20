

export enum UserRole {
    ADMIN = 'Admin',
    OPERATOR = 'Operator', 
}

export enum DisputeStatus {
  Processing = 'Processing',
  Verified = 'Verified', 
  Rejected = 'Rejected', 
  Contested = 'Contested', 
  Settled = 'Settled' 
}


export enum RiskLevel {
  HIGH = 'High',
  INTERMEDIATE = 'Intermediate', 
  LOW = 'Low'
}

export enum AssetType {
  Machinery = 'Machinery',
  Vehicle = 'Vehicle', 
  Property = 'Property'
}
export enum DocumentType {
  License = 'License',
  NationalID = 'Omang', 
  Passport = 'Passport'
}

export enum VolunteerStatus {
  RESPONDING = 'Responding',
  EN_ROUTE = 'En Route',
  IDLE = 'Idle', 
  UNAVAILABLE = 'Unavailable'
}
