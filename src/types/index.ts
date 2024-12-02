export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  skills: Skill[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isAdmin?: boolean;
  verifiedSkills?: string[];
  identityVerified?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  tags: string[];
  userId?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  verificationDocuments?: VerificationDocument[];
}

export interface VerificationDocument {
  id: string;
  type: 'certificate' | 'diploma' | 'license' | 'other';
  name: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface Review {
  id: string;
  userId: string;
  skillId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  reviewer: {
    id: string;
    name: string;
    profileImage?: string;
  };
  status: 'pending' | 'approved' | 'flagged';
  adminNotes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
  isFlagged?: boolean;
  adminReview?: {
    status: 'pending' | 'reviewed';
    notes?: string;
  };
}

export interface SkillSwapRequest {
  id: string;
  requesterId: string;
  providerId: string;
  requestedSkillId: string;
  offeredSkillId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'disputed';
  message: string;
  createdAt: Date;
  disputeDetails?: {
    reason: string;
    status: 'pending' | 'resolved';
    resolution?: string;
    adminNotes?: string;
  };
}

export interface AdminState {
  pendingVerifications: number;
  pendingReviews: number;
  activeDisputes: number;
  flaggedMessages: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: { name: string; bio?: string; email: string }) => Promise<void>;
  requestIdentityVerification: (documents: File[]) => Promise<void>;
  requestSkillVerification: (skillId: string, documents: File[]) => Promise<void>;
}