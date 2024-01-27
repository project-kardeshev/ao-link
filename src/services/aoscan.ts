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

export const aoEvents = async (all?: boolean): Promise<IAOEvents[] | null> => {
  try {
    let supabaseRq;

    if (all) {
      supabaseRq = supabase
        .from("ao_events")
        .select("owner,id,tags_flat,target,owner_address,height,created_at")
        .order("created_at", { ascending: false });
    } else {
      supabaseRq = supabase
        .from("ao_events")
        .select("owner,id,tags_flat,target,owner_address,height,created_at")
        .order("created_at", { ascending: false })
        .range(0, 30);
    }
    const { data } = await supabaseRq;
    if (data) {
      return data as IAOEvents[];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const aoEvent = async ({
  id,
}: {
  id: string;
}): Promise<IAOEvents> => {
    const { data } = await supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .eq("id", id);

    if (data && data.length) {
      return data[0] as IAOEvents;
    }

    return {
      owner: '',
      id: '',
      tags_flat: [],
      target: '',
      owner_address: '',
      height: 0,
      created_at: ''
  }
};
