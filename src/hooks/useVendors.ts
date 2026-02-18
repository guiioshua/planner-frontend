import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Vendor } from "@/types";
import {
  createVendor,
  deleteVendorApi,
  getVendors,
  updateVendorApi,
  type VendorApi,
} from "@/lib/api";

function mapVendor(api: VendorApi): Vendor {
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

export function useVendors() {
  const queryClient = useQueryClient();
  const [totalBudget, setTotalBudget] = useState<number>(0);

  const vendorsQuery = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await getVendors();
      const mapped = data.map(mapVendor);
      if (totalBudget === 0) {
        const initialBudget = mapped.reduce((s, v) => s + v.totalPrice, 0);
        setTotalBudget(initialBudget);
      }
      return mapped;
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: Omit<Vendor, "id">) => createVendor(data).then(mapVendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Omit<Vendor, "id">> }) =>
      updateVendorApi(payload.id, payload.data).then(mapVendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVendorApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  const vendors = vendorsQuery.data ?? [];

  const servicesTotal = vendors.reduce((s, v) => s + v.totalPrice, 0);
  const totalPaid = vendors.reduce((s, v) => s + v.amountPaid, 0);

  const budgetStats = {
    totalBudget,
    servicesTotal,
    totalPaid,
    remaining: Math.max(totalBudget - totalPaid, 0),
  };

  const addVendor = (data: Omit<Vendor, "id">) => addMutation.mutateAsync(data);
  const updateVendor = (id: string, data: Partial<Omit<Vendor, "id">>) =>
    updateMutation.mutateAsync({ id, data });
  const deleteVendor = (id: string) => deleteMutation.mutateAsync(id);

  return { vendors, budgetStats, totalBudget, setTotalBudget, addVendor, updateVendor, deleteVendor };
}
