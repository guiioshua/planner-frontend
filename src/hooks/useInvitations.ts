import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Invitation, RSVPStatus, GuestWithMeta, InvitationStats } from "@/types";
import {
  confirmRsvp,
  createInvitation,
  deleteInvitation,
  getInvitations,
  updateInvitation,
  type CreateInvitationPayload,
} from "@/lib/api";
import { mapInvitation } from "@/lib/mappers";

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

  const allGuests: GuestWithMeta[] = invitations.flatMap((inv) =>
    inv.people.map((p) => ({ ...p, familyName: inv.familyName, invitationType: inv.type, invitationId: inv.id, invitationSlug: inv.slug }))
  );

  const stats: InvitationStats = {
    totalInvitations: invitations.length,
    confirmedGuests: allGuests.filter((g) => g.status === "confirmed").length,
    pendingGuests: allGuests.filter((g) => g.status === "pending").length,
    declinedGuests: allGuests.filter((g) => g.status === "declined").length,
    totalGuests: allGuests.length,
    godparentConfirmed: allGuests.filter((g) => g.invitationType === "godparent" && g.status === "confirmed").length,
    totalChildren: allGuests.filter((g) => g.isChild).length,
    confirmedChildren: allGuests.filter((g) => g.isChild && g.status === "confirmed").length,
  };

  const addInvitation = (data: Omit<Invitation, "id" | "slug" | "createdAt">, file?: File) => {
    const payload: CreateInvitationPayload = {
      familyName: data.familyName,
      type: data.type === "godparent" ? "GODPARENT" : "STANDARD",
      messageBody: data.message,
      categories: data.categories,
      coverImageUrl: data.coverImageUrl || undefined,
      guests: data.people.map(p => ({ fullName: p.name, phone: p.phone, status: p.status, isChild: p.isChild })),
    };
    return addMutation.mutateAsync({ payload, file });
  };

  const updateInvitationFn = (id: string, data: Partial<Omit<Invitation, "id" | "slug">>, file?: File) => {
    const current = invitations.find((i) => i.id === id);
    if (!current) throw new Error("Convite não encontrado");

    const merged = { ...current, ...data };

    const payload: CreateInvitationPayload = {
      familyName: merged.familyName,
      type: merged.type === "godparent" ? "GODPARENT" : "STANDARD",
      messageBody: merged.message,
      categories: merged.categories,
      coverImageUrl: merged.coverImageUrl || undefined,
      guests: merged.people.map(p => ({ fullName: p.name, phone: p.phone, status: p.status, isChild: p.isChild })),
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
