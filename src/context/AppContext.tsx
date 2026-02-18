import React, { createContext, useContext, ReactNode } from "react";
import { useInvitations } from "@/hooks/useInvitations";
import { useGifts } from "@/hooks/useGifts";
import { useVendors } from "@/hooks/useVendors";

type AppContextType = ReturnType<typeof useInvitations> &
  ReturnType<typeof useGifts> &
  ReturnType<typeof useVendors>;

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const invitations = useInvitations();
  const giftsHook = useGifts();
  const vendorsHook = useVendors();

  return (
    <AppContext.Provider value={{ ...invitations, ...giftsHook, ...vendorsHook }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
