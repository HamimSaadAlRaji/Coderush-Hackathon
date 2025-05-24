import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    university?: string;
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

const AcademicInfoSchema = new Schema({
  department: { type: String, trim: true },
  program: { type: String, trim: true },
  year: { type: Number, min: 1, max: 8 },
  studentId: { type: String, trim: true }
});

const UserSchema = new Schema<IUser>({
  clerkId: { 
    type: String, 
    required: true,
    unique: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  phoneNumber: { 
    type: String,
    trim: true
  },
  dateOfBirth: { 
    type: Date
  },
  university: { 
    type: String,
    trim: true
  },
  academicInfo: AcademicInfoSchema,
  role: { 
    type: String, 
    enum: ['student', 'admin', 'superadmin'],
    default: 'student'
  },
  isVerified: { 
    type: Boolean, 
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePicture: String,
  rating: { 
    type: Number, 
    min: 0, 
    max: 5,
    default: 0
  },
  reviewCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  bannedUntil: Date,
  banReason: String
}, {
  timestamps: true
});

// Create indexes
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ university: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);