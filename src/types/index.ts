export type InvitationType = "standard" | "godparent";
export type RSVPStatus = "pending" | "confirmed" | "declined";

export interface Person {
  id: string;
  name: string;
  phone: string;
  status: RSVPStatus;
  isChild: boolean;
}

export interface Invitation {
  id: string;
  slug: string;
  familyName: string;
  type: InvitationType;
  coverImageUrl: string;
  message: string;
  categories: string[];
  people: Person[];
  createdAt: string;
}

export type GiftStatus = "AVAILABLE" | "CHOSEN";

export interface Gift {
  id: string;
  name: string;
  imageUrl: string;
  purchaseLink: string;
  visible: boolean;
  category: string;
  status: GiftStatus;
  chosenByFamilyName?: string | null;
}

export interface Vendor {
  id: string;
  company: string;
  category: string;
  contact: string;
  phone: string;
  totalPrice: number;
  amountPaid: number;
  notes: string;
}

/** Guest row enriched with invitation context — produced by useInvitations. */
export interface GuestWithMeta extends Person {
  familyName: string;
  invitationType: InvitationType;
  invitationId: string;
  invitationSlug: string;
}

export interface BudgetStats {
  totalBudget: number;
  servicesTotal: number;
  totalPaid: number;
  remaining: number;
}

export interface InvitationStats {
  totalInvitations: number;
  confirmedGuests: number;
  pendingGuests: number;
  declinedGuests: number;
  totalGuests: number;
  godparentConfirmed: number;
  totalChildren: number;
  confirmedChildren: number;
}
