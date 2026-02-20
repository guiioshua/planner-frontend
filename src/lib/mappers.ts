import type { Invitation, Gift, Vendor, RSVPStatus } from "@/types";
import type { InvitationApi, GiftApi, VendorApi } from "@/lib/api";

/** Map backend invitation DTO → frontend Invitation model. */
export function mapInvitation(api: InvitationApi): Invitation {
    return {
        id: api.id,
        slug: api.slug,
        familyName: api.familyName,
        type: api.type === "GODPARENT" ? "godparent" : "standard",
        coverImageUrl: api.coverImageUrl ?? "",
        message: api.messageBody ?? "",
        categories: api.categories ?? ["A"],
        createdAt: api.createdAt,
        people: api.guests.map((g) => ({
            id: g.id,
            name: g.fullName,
            phone: g.phone ?? "",
            status: g.status.toLowerCase() as RSVPStatus,
            isChild: g.isChild,
        })),
    };
}

/** Map backend gift DTO → frontend Gift model. */
export function mapGift(api: GiftApi): Gift {
    return {
        id: api.id,
        name: api.name,
        imageUrl: api.imageUrl ?? "",
        purchaseLink: api.purchaseLink ?? "",
        visible: api.visible,
        category: api.category ?? "A",
        status: api.status,
        chosenByFamilyName: api.chosenByFamilyName ?? null,
    };
}

/** Map backend vendor DTO → frontend Vendor model. */
export function mapVendor(api: VendorApi): Vendor {
    return {
        id: api.id,
        company: api.companyName,
        category: api.serviceCategory,
        contact: api.contactName ?? "",
        phone: api.contactPhone ?? "",
        totalPrice: api.price,
        amountPaid: api.amountPaid ?? 0,
        notes: api.notes ?? "",
    };
}
