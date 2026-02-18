export type InvitationType = "standard" | "godparent";
export type RSVPStatus = "pending" | "confirmed" | "declined";

export interface Person {
  id: string;
  name: string;
  phone: string;
  status: RSVPStatus;
}

export interface Invitation {
  id: string;
  slug: string;
  familyName: string;
  type: InvitationType;
  coverImageUrl: string;
  message: string;
  people: Person[];
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  imageUrl: string;
  purchaseUrl: string;
  active: boolean;
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
