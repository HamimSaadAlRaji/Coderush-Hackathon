interface CampusLocation {
    _id: string;
    university: string;
    name: string;
    description?: string;
    coordinates: [number, number]; // [longitude, latitude]
    type: 'landmark' | 'meetup-spot' | 'security-post';
    image?: string;
    approved: boolean;
    addedBy: string; // user ID
    createdAt: Date;
  }