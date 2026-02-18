import { useState, useCallback } from "react";
import { Vendor } from "@/types";
import { mockVendors } from "@/data/mock";

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);

  const addVendor = useCallback((data: Omit<Vendor, "id">) => {
    const vendor: Vendor = { ...data, id: crypto.randomUUID() };
    setVendors((prev) => [...prev, vendor]);
    return vendor;
  }, []);

  const updateVendor = useCallback((id: string, data: Partial<Omit<Vendor, "id">>) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
  }, []);

  const deleteVendor = useCallback((id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const budgetStats = {
    totalBudget: vendors.reduce((s, v) => s + v.totalPrice, 0),
    totalPaid: vendors.reduce((s, v) => s + v.amountPaid, 0),
    remaining: vendors.reduce((s, v) => s + (v.totalPrice - v.amountPaid), 0),
  };

  return { vendors, budgetStats, addVendor, updateVendor, deleteVendor };
}
