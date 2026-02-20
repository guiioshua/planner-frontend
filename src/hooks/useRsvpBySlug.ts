import { useQuery } from "@tanstack/react-query";
import { getInvitationBySlug } from "@/lib/api";
import { mapInvitation } from "@/lib/mappers";

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
