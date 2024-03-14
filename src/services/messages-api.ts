import { supabase } from "@/lib/supabase"

import { AoEvent } from "./aoscan"

export async function getOutboxMessages(
  limit = 1000,
  skip = 0,
  sender?: string,
): Promise<AoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })

    if (sender) {
      supabaseRq
        .or(
          `tags_flat ->> Forwarded-For.eq.${sender},tags_flat ->> Forwarded-For.is.null`,
        )
        .or(
          `tags_flat ->> From-Process.eq.${sender},tags_flat ->> From-Process.is.null`,
        )
        .or(`owner_address.eq.${sender}`)
    }

    supabaseRq = supabaseRq.range(skip, skip + limit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data
  } catch (error) {
    return []
  }
}

export async function getInboxMessages(
  limit = 1000,
  skip = 0,
  receiver?: string,
): Promise<AoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })

    if (receiver) {
      supabaseRq.eq("target", receiver)
    }

    supabaseRq = supabaseRq.range(skip, skip + limit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data
  } catch (error) {
    return []
  }
}

export async function getTokenTransfers(
  limit = 1000,
  skip = 0,
  processId?: string,
): Promise<AoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })

    if (processId) {
      supabaseRq
        .or(
          `tags_flat ->> Action.eq.Credit-Notice,tags_flat ->> Action.eq.Debit-Notice,tags_flat ->> Action.eq.Transfer`,
        )
        .or(`owner_address.eq.${processId},target.eq.${processId}`)
    }

    supabaseRq = supabaseRq.range(skip, skip + limit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data
  } catch (error) {
    return []
  }
}
