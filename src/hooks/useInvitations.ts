import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Invitation, Person, RSVPStatus } from "@/types";
import {
  confirmRsvp,
  createInvitation,
  deleteInvitation,
  getInvitations,
  updateInvitation,
  type InvitationApi,
  type CreateInvitationPayload,
} from "@/lib/api";

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

export function useInvitations() {
  const queryClient = useQueryClient();

  const invitationsQuery = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const data = await getInvitations();
      return data.map(mapInvitation);
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: { payload: CreateInvitationPayload, file?: File }) =>
      createInvitation(data.payload, data.file).then(mapInvitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; payload: CreateInvitationPayload, file?: File }) =>
      updateInvitation(args.id, args.payload, args.file).then(mapInvitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (payload: { slug: string; statuses: Record<string, RSVPStatus> }) =>
      confirmRsvp(payload.slug, payload.statuses).then(mapInvitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const invitations = invitationsQuery.data ?? [];

  const getBySlug = useCallback(
    (slug: string) => invitations.find((inv) => inv.slug === slug),
    [invitations]
  );

  const allGuests = invitations.flatMap((inv) =>
    inv.people.map((p) => ({ ...p, familyName: inv.familyName, invitationType: inv.type, invitationId: inv.id }))
  );

  const stats = {
    totalInvitations: invitations.length,
    confirmedGuests: allGuests.filter((g) => g.status === "confirmed").length,
    pendingGuests: allGuests.filter((g) => g.status === "pending").length,
    declinedGuests: allGuests.filter((g) => g.status === "declined").length,
    totalGuests: allGuests.length,
    godparentConfirmed: allGuests.filter((g) => g.invitationType === "godparent" && g.status === "confirmed").length,
  };

  const addInvitation = (data: Omit<Invitation, "id" | "slug" | "createdAt">, file?: File) => {
    const payload: CreateInvitationPayload = {
      familyName: data.familyName,
      type: data.type === "godparent" ? "GODPARENT" : "STANDARD",
      messageBody: data.message,
      coverImageUrl: data.coverImageUrl || undefined,
      guests: data.people.map(p => ({ fullName: p.name, phone: p.phone })),
    };
    return addMutation.mutateAsync({ payload, file });
  };

  const updateInvitationFn = (id: string, data: Partial<Omit<Invitation, "id" | "slug">>, file?: File) => {
    // We need to construct a full payload for update because the API expects full object or at least we need to merge
    // But since the UI provides full state, we can merge with existing if needed, or better, the UI should provide complete data.
    // However, the `updateInvitation` function in api.ts takes `CreateInvitationPayload`.
    // We'll rely on the caller to provide complete data or merge with current locally before calling.

    // To support partial updates properly we should merge with current data here like before
    const current = invitations.find((i) => i.id === id);
    if (!current) throw new Error("Convite não encontrado");

    const merged = { ...current, ...data };

    const payload: CreateInvitationPayload = {
      familyName: merged.familyName,
      type: merged.type === "godparent" ? "GODPARENT" : "STANDARD",
      messageBody: merged.message,
      // Preserve the existing image URL so it isn't cleared when no new file is selected
      coverImageUrl: merged.coverImageUrl || undefined,
      guests: merged.people.map(p => ({ fullName: p.name, phone: p.phone })),
    };

    return updateMutation.mutateAsync({ id, payload, file });
  };

  const deleteInvitationFn = (id: string) => deleteMutation.mutateAsync(id);
  const confirmRSVP = (slug: string, statuses: Record<string, RSVPStatus>) =>
    confirmMutation.mutateAsync({ slug, statuses });

  return {
    invitations,
    allGuests,
    stats,
    addInvitation,
    updateInvitation: updateInvitationFn,
    deleteInvitation: deleteInvitationFn,
    confirmRSVP,
    getBySlug,
    isLoading: invitationsQuery.isLoading,
    error: invitationsQuery.error,
  };
}
