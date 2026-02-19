import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift } from "@/types";
import {
  createGift,
  deleteGiftApi,
  getVisibleGifts,
  getGifts,
  updateGift,
  chooseGiftApi,
  type GiftApi,
} from "@/lib/api";

function mapGift(api: GiftApi): Gift {
  return {
    id: api.id,
    name: api.name,
    imageUrl: api.imageUrl ?? "",
    purchaseLink: api.purchaseLink ?? "",
    visible: api.visible,
    status: api.status,
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

  const visibleGiftsQuery = useQuery({
    queryKey: ["gifts", "visible"],
    queryFn: async () => {
      const data = await getVisibleGifts();
      return data.map(mapGift);
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: Omit<Gift, "id">) => createGift(data).then(mapGift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts", "visible"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Omit<Gift, "id">> }) =>
      updateGift(payload.id, payload.data).then(mapGift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts", "visible"] });
    },
  });

  const chooseMutation = useMutation({
    mutationFn: (id: string) => chooseGiftApi(id).then(mapGift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts", "visible"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGiftApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gifts", "visible"] });
    },
  });

  const gifts = giftsQuery.data ?? [];
  const visibleGifts = visibleGiftsQuery.data ?? [];

  const addGift = (data: Omit<Gift, "id">) => addMutation.mutateAsync(data);

  const updateGiftFn = useCallback(
    (id: string, data: Partial<Omit<Gift, "id">>) => {
      const current = gifts.find((g) => g.id === id);
      if (!current) throw new Error("Presente não encontrado");
      const merged = { ...current, ...data };
      return updateMutation.mutateAsync({ id, data: merged });
    },
    [gifts, updateMutation]
  );

  const deleteGift = (id: string) => deleteMutation.mutateAsync(id);
  const chooseGift = (id: string) => chooseMutation.mutateAsync(id);

  const toggleVisible = useCallback(
    (id: string) => {
      const current = gifts.find((g) => g.id === id);
      if (!current) return;
      updateGiftFn(id, { visible: !current.visible });
    },
    [gifts, updateGiftFn]
  );

  return {
    gifts,
    visibleGifts,
    addGift,
    updateGift: updateGiftFn,
    deleteGift,
    chooseGift,
    toggleVisible,
    isLoading: giftsQuery.isLoading || visibleGiftsQuery.isLoading
  };
}
