import { useState, useCallback } from "react";
import { Invitation, Person, RSVPStatus } from "@/types";
import { mockInvitations } from "@/data/mock";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);

  const addInvitation = useCallback((data: Omit<Invitation, "id" | "slug" | "createdAt">) => {
    const inv: Invitation = {
      ...data,
      id: crypto.randomUUID(),
      slug: generateSlug(data.familyName) + "-" + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setInvitations((prev) => [...prev, inv]);
    return inv;
  }, []);

  const updateInvitation = useCallback((id: string, data: Partial<Omit<Invitation, "id" | "slug">>) => {
    setInvitations((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)));
  }, []);

  const deleteInvitation = useCallback((id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  const updatePersonStatus = useCallback((invitationId: string, personId: string, status: RSVPStatus) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              people: inv.people.map((p) => (p.id === personId ? { ...p, status } : p)),
            }
          : inv
      )
    );
  }, []);

  const confirmRSVP = useCallback((slug: string, statuses: Record<string, RSVPStatus>) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.slug === slug
          ? {
              ...inv,
              people: inv.people.map((p) => (statuses[p.id] ? { ...p, status: statuses[p.id] } : p)),
            }
          : inv
      )
    );
  }, []);

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

  return {
    invitations,
    allGuests,
    stats,
    addInvitation,
    updateInvitation,
    deleteInvitation,
    updatePersonStatus,
    confirmRSVP,
    getBySlug,
  };
}
