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
