import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  neighborhood: string;
  state: string;
  description: string;
  photoUrl?: string;
  rating: number;
  totalRatings: number;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment: string;
  createdAt: number;
}

export interface Ad {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'donation' | 'exchange';
  condition: string;
  frameStyle: string;
  targetAudience: 'adult' | 'child' | 'unisex';
  prescriptionSummary: string;
  lensDetails: string;
  city: string;
  state: string;
  neighborhood: string;
  status: 'active' | 'completed' | 'blocked' | 'review';
  photoUrl: string;
  photoUrls: string[];
  createdAt: number;
}

export interface PrescriptionRequest {
  id: string;
  userId: string;
  patientName: string;
  description: string;
  prescriptionPhotoUrl: string;
  documentPhotoUrl: string;
  prescriptionSummary: string;
  status: 'pending' | 'adopted' | 'completed' | 'rejected';
  donorId?: string;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  ads: Ad[];
  prescriptionRequests: PrescriptionRequest[];
  ratings: Record<string, Rating[]>; // userId -> ratings
  login: (user: User) => void;
  logout: () => void;
  setAds: (ads: Ad[]) => void;
  addRating: (rating: Rating) => void;
  completeAd: (adId: string) => void;
  addPrescriptionRequest: (request: PrescriptionRequest) => void;
  adoptPrescriptionRequest: (requestId: string, donorId: string) => void;
  completePrescriptionRequest: (requestId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  ads: [],
  prescriptionRequests: [],
  ratings: {},
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setAds: (ads) => set({ ads }),
  addRating: (rating) => set((state) => {
    const userRatings = state.ratings[rating.toUserId] || [];
    return {
      ratings: {
        ...state.ratings,
        [rating.toUserId]: [...userRatings, rating],
      }
    };
  }),
  completeAd: (adId) => set((state) => ({
    ads: state.ads.map((ad) => 
      ad.id === adId ? { ...ad, status: 'completed' } : ad
    ),
  })),
  addPrescriptionRequest: (request) => set((state) => ({
    prescriptionRequests: [request, ...state.prescriptionRequests]
  })),
  adoptPrescriptionRequest: (requestId, donorId) => set((state) => ({
    prescriptionRequests: state.prescriptionRequests.map((req) => 
      req.id === requestId ? { ...req, status: 'adopted', donorId } : req
    )
  })),
  completePrescriptionRequest: (requestId) => set((state) => ({
    prescriptionRequests: state.prescriptionRequests.map((req) => 
      req.id === requestId ? { ...req, status: 'completed' } : req
    )
  })),
}));
