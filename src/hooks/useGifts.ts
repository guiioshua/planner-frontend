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
} from "@/lib/api";
import { mapGift } from "@/lib/mappers";

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
    mutationFn: ({ id, slug }: { id: string; slug?: string }) =>
      chooseGiftApi(id, slug).then(mapGift),
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

  const toggleVisible = useCallback(
    (id: string) => {
      const current = giftsQuery.data?.find((g) => g.id === id);
      if (!current) return;
      updateMutation.mutate({ id, data: { ...current, visible: !current.visible } });
    },
    [giftsQuery.data, updateMutation]
  );

  const gifts = giftsQuery.data ?? [];
  const visibleGifts = visibleGiftsQuery.data ?? [];

  const addGift = (data: Omit<Gift, "id">) => addMutation.mutateAsync(data);
  const updateGiftFn = (id: string, data: Partial<Omit<Gift, "id">>) =>
    updateMutation.mutateAsync({ id, data });
  const deleteGift = (id: string) => deleteMutation.mutateAsync(id);
  const chooseGift = (id: string, slug?: string) =>
    chooseMutation.mutateAsync({ id, slug });

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
