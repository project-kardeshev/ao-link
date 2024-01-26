"use server";

import { supabase } from "@/lib/supabase";

export interface IAOEvents {
  owner: string;
  id: string;
  tags_flat: Record<string, any>;
  target: string;
  owner_address: string;
  height: number;
  created_at: string;
}

export const aoEvents = async (): Promise<IAOEvents[] | null> => {
  try {
    const { data } = await supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .range(0, 20);

    if (data) {
      return data as IAOEvents[];
    }

    return null;
  } catch (error) {
    return null;
  }
};
