import { useQuery } from "@tanstack/react-query";
import { getInvitationBySlug, type InvitationApi } from "@/lib/api";
import { Invitation, RSVPStatus } from "@/types";

function mapInvitation(api: InvitationApi): Invitation {
    return {
        id: api.id,
        slug: api.slug,
        familyName: api.familyName,
        type: api.type === "GODPARENT" ? "godparent" : "standard",
        coverImageUrl: api.coverImageUrl ?? "",
        message: api.messageBody ?? "",
        createdAt: api.createdAt,
        people: api.guests.map((g) => ({
            id: g.id,
            name: g.fullName,
            phone: g.phone ?? "",
            status: g.status.toLowerCase() as RSVPStatus,
        })),
    };
}

export function useRsvpBySlug(slug: string | undefined) {
    return useQuery({
        queryKey: ["invitation", slug],
        queryFn: async () => {
            if (!slug) throw new Error("Slug is required");
            const data = await getInvitationBySlug(slug);
            return mapInvitation(data);
        },
        enabled: !!slug,
        retry: 1,
    });
}
