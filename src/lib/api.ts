import { Invitation, Gift, Vendor, RSVPStatus, GiftStatus } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081/api/v1";

async function http<T>(input: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  // Only set Content-Type to JSON if body is NOT FormData
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// Invitations / Guests

export interface InvitationApi {
  id: string;
  familyName: string;
  type: "STANDARD" | "GODPARENT";
  slug: string;
  coverImageUrl: string | null;
  messageBody: string | null;
  createdAt: string;
  guests: {
    id: string;
    fullName: string;
    phone: string | null;
    status: "PENDING" | "CONFIRMED" | "DECLINED";
  }[];
}

export interface CreateInvitationPayload {
  familyName: string;
  type: "STANDARD" | "GODPARENT";
  messageBody?: string;
  /** Fallback URL used when no new coverImage file is uploaded. */
  coverImageUrl?: string;
  guests?: { fullName: string; phone?: string; status?: RSVPStatus }[];
}

export async function getInvitations(): Promise<InvitationApi[]> {
  return http<InvitationApi[]>("/invitations");
}

export async function createInvitation(payload: CreateInvitationPayload, coverImage?: File): Promise<InvitationApi> {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  formData.append("data", jsonBlob);

  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  return http<InvitationApi>("/invitations", {
    method: "POST",
    body: formData,
  });
}

export async function updateInvitation(id: string, payload: CreateInvitationPayload, coverImage?: File): Promise<InvitationApi> {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  formData.append("data", jsonBlob);

  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  return http<InvitationApi>(`/invitations/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteInvitation(id: string): Promise<void> {
  return http<void>(`/invitations/${id}`, { method: "DELETE" });
}

export async function getInvitationBySlug(slug: string): Promise<InvitationApi> {
  return http<InvitationApi>(`/rsvp/${slug}`);
}

export async function confirmRsvp(slug: string, statuses: Record<string, RSVPStatus>): Promise<InvitationApi> {
  // Backend espera map guestId -> GuestStatus (enum em caixa alta)
  const payload = {
    statuses: Object.fromEntries(
      Object.entries(statuses).map(([guestId, status]) => [
        guestId,
        status.toUpperCase(),
      ]),
    ),
  };

  return http<InvitationApi>(`/rsvp/${slug}/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Gifts

export interface GiftApi {
  id: string;
  name: string;
  purchaseLink: string | null;
  imageUrl: string | null;
  status: "AVAILABLE" | "CHOSEN";
  visible: boolean;
  chosenByFamilyName?: string | null;
}

export async function getGifts(): Promise<GiftApi[]> {
  return http<GiftApi[]>("/gifts");
}

export async function getVisibleGifts(): Promise<GiftApi[]> {
  return http<GiftApi[]>("/gifts/visible");
}

export async function createGift(payload: Omit<Gift, "id">): Promise<GiftApi> {
  return http<GiftApi>("/gifts", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      purchaseLink: payload.purchaseLink,
      imageUrl: payload.imageUrl,
      visible: payload.visible,
      status: payload.status,
    }),
  });
}

export async function updateGift(id: string, payload: Partial<Omit<Gift, "id">>): Promise<GiftApi> {
  return http<GiftApi>(`/gifts/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: payload.name,
      purchaseLink: payload.purchaseLink,
      imageUrl: payload.imageUrl,
      visible: payload.visible,
      status: payload.status,
    }),
  });
}

export async function chooseGiftApi(id: string, invitationSlug?: string): Promise<GiftApi> {
  return http<GiftApi>(`/gifts/${id}/choose`, {
    method: "PATCH",
    body: JSON.stringify({ invitationSlug: invitationSlug ?? null }),
  });
}

export async function deleteGiftApi(id: string): Promise<void> {
  return http<void>(`/gifts/${id}`, { method: "DELETE" });
}

// Vendors

export interface VendorApi {
  id: string;
  companyName: string;
  serviceCategory: string;
  contactName: string | null;
  contactPhone: string | null;
  price: number;
  amountPaid: number | null;
  notes: string | null;
  // TODO: Add any new fields if backend changes
}

export async function getVendors(): Promise<VendorApi[]> {
  return http<VendorApi[]>("/vendors");
}

export async function createVendor(payload: Omit<Vendor, "id">): Promise<VendorApi> {
  return http<VendorApi>("/vendors", {
    method: "POST",
    body: JSON.stringify({
      companyName: payload.company,
      serviceCategory: payload.category,
      contactName: payload.contact,
      contactPhone: payload.phone,
      price: payload.totalPrice,
      amountPaid: payload.amountPaid,
      notes: payload.notes,
    }),
  });
}

export async function updateVendorApi(id: string, payload: Partial<Omit<Vendor, "id">>): Promise<VendorApi> {
  return http<VendorApi>(`/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      companyName: payload.company,
      serviceCategory: payload.category,
      contactName: payload.contact,
      contactPhone: payload.phone,
      price: payload.totalPrice,
      amountPaid: payload.amountPaid,
      notes: payload.notes,
    }),
  });
}

export async function deleteVendorApi(id: string): Promise<void> {
  return http<void>(`/vendors/${id}`, { method: "DELETE" });
}

