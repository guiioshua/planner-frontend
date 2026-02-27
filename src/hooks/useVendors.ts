import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Vendor, BudgetStats } from "@/types";
import {
  createVendor,
  deleteVendorApi,
  getVendors,
  updateVendorApi,
} from "@/lib/api";
import { mapVendor } from "@/lib/mappers";

export function useVendors() {
  const queryClient = useQueryClient();
  const [totalBudget, setTotalBudget] = useState<number>(0);

  const vendorsQuery = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await getVendors();
      return data.map(mapVendor);
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: Omit<Vendor, "id">) => createVendor(data).then(mapVendor),
    onSuccess: (newVendor) => {
      queryClient.setQueryData<Vendor[]>(["vendors"], (prev = []) => [...prev, newVendor]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Omit<Vendor, "id">> }) =>
      updateVendorApi(payload.id, payload.data).then(mapVendor),
    onSuccess: (updatedVendor) => {
      queryClient.setQueryData<Vendor[]>(["vendors"], (prev = []) =>
        prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v))
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVendorApi(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Vendor[]>(["vendors"], (prev = []) =>
        prev.filter((v) => v.id !== id)
      );
    },
  });

  const vendors = vendorsQuery.data ?? [];

  const servicesTotal = vendors.reduce((s, v) => s + v.totalPrice, 0);
  const totalPaid = vendors.reduce((s, v) => s + v.amountPaid, 0);

  const budgetStats: BudgetStats = {
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
