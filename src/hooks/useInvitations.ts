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

function toCreatePayload(inv: Omit<Invitation, "id" | "slug" | "createdAt">): CreateInvitationPayload {
  return {
    familyName: inv.familyName,
    type: inv.type === "godparent" ? "GODPARENT" : "STANDARD",
    coverImageUrl: inv.coverImageUrl || undefined,
    messageBody: inv.message || undefined,
    guests: inv.people.map((p) => ({ fullName: p.name, phone: p.phone || undefined })),
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
    mutationFn: (data: Omit<Invitation, "id" | "slug" | "createdAt">) =>
      createInvitation(toCreatePayload(data)).then(mapInvitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Omit<Invitation, "id" | "slug">> }) => {
      const current = invitationsQuery.data?.find((i) => i.id === payload.id);
      if (!current) throw new Error("Convite não encontrado");
      const merged: Omit<Invitation, "id" | "slug" | "createdAt"> = {
        familyName: payload.data.familyName ?? current.familyName,
        type: payload.data.type ?? current.type,
        coverImageUrl: payload.data.coverImageUrl ?? current.coverImageUrl,
        message: payload.data.message ?? current.message,
        people: (payload.data.people ?? current.people) as Person[],
      };
      return updateInvitation(payload.id, toCreatePayload(merged)).then(mapInvitation);
    },
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

  const addInvitation = (data: Omit<Invitation, "id" | "slug" | "createdAt">) => addMutation.mutateAsync(data);
  const updateInvitationFn = (id: string, data: Partial<Omit<Invitation, "id" | "slug">>) =>
    updateMutation.mutateAsync({ id, data });
  const deleteInvitationFn = (id: string) => deleteMutation.mutateAsync(id);
  const confirmRSVP = (slug: string, statuses: Record<string, RSVPStatus>) =>
    confirmMutation.mutateAsync({ slug, statuses });

  const updatePersonStatus = useCallback(
    (invitationId: string, personId: string, status: RSVPStatus) => {
      const inv = invitations.find((i) => i.id === invitationId);
      if (!inv) return;
      const updatedPeople = inv.people.map((p) => (p.id === personId ? { ...p, status } : p));
      updateInvitationFn(invitationId, { people: updatedPeople });
    },
    [invitations, updateInvitationFn]
  );

  return {
    invitations,
    allGuests,
    stats,
    addInvitation,
    updateInvitation: updateInvitationFn,
    deleteInvitation: deleteInvitationFn,
    updatePersonStatus,
    confirmRSVP,
    getBySlug,
    isLoading: invitationsQuery.isLoading,
    error: invitationsQuery.error,
  };
}
