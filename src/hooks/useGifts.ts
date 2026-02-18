import { useState, useCallback } from "react";
import { Gift } from "@/types";
import { mockGifts } from "@/data/mock";

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>(mockGifts);

  const addGift = useCallback((data: Omit<Gift, "id">) => {
    const gift: Gift = { ...data, id: crypto.randomUUID() };
    setGifts((prev) => [...prev, gift]);
    return gift;
  }, []);

  const updateGift = useCallback((id: string, data: Partial<Omit<Gift, "id">>) => {
    setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
  }, []);

  const deleteGift = useCallback((id: string) => {
    setGifts((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const toggleActive = useCallback((id: string) => {
    setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, active: !g.active } : g)));
  }, []);

  const activeGifts = gifts.filter((g) => g.active);

  return { gifts, activeGifts, addGift, updateGift, deleteGift, toggleActive };
}
