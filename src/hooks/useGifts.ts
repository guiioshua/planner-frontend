import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift } from "@/types";
import {
  createGift,
  deleteGiftApi,
  getActiveGifts,
  getGifts,
  updateGift,
  type GiftApi,
} from "@/lib/api";

function mapGift(api: GiftApi): Gift {
  return {
    id: api.id,
    name: api.name,
    imageUrl: api.imageUrl ?? "",
    purchaseUrl: api.purchaseLink ?? "",
    active: api.active,
  };
}

export function useGifts() {
  const queryClient = useQueryClient();

  const giftsQuery = useQuery({
    queryKey: ["gifts"],
    queryFn: async () => {
      const data = await getGifts();
      return data.map(mapGift);
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: Omit<Gift, "id">) => createGift(data).then(mapGift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Omit<Gift, "id">> }) =>
      updateGift(payload.id, payload.data).then(mapGift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGiftApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
  });

  const toggleActive = useCallback(
    (id: string) => {
      const current = giftsQuery.data?.find((g) => g.id === id);
      if (!current) return;
      updateMutation.mutate({ id, data: { active: !current.active } });
    },
    [giftsQuery.data, updateMutation]
  );

  const gifts = giftsQuery.data ?? [];
  const activeGifts = gifts.filter((g) => g.active);

  const addGift = (data: Omit<Gift, "id">) => addMutation.mutateAsync(data);
  const updateGiftFn = (id: string, data: Partial<Omit<Gift, "id">>) =>
    updateMutation.mutateAsync({ id, data });
  const deleteGift = (id: string) => deleteMutation.mutateAsync(id);

  return { gifts, activeGifts, addGift, updateGift: updateGiftFn, deleteGift, toggleActive };
}
