interface User {
    _id: string;
    email: string; // University email
    password: string; // Hashed
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    university: {
      name: string;
      domain: string; // e.g., "iut-dhaka.edu"
    };
    academicInfo?: {
      department: string;
      program: string;
      year: number;
      studentId?: string;
    };
    role: 'student' | 'admin' | 'superadmin';
    isVerified: boolean;
    verificationToken?: string;
    verificationExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    profilePicture?: string;
    rating?: number;
    reviewCount?: number;
    bannedUntil?: Date;
    banReason?: string;
  }