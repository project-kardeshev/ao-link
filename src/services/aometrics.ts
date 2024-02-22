"use server"

import { supabase } from "@/lib/supabase"
import {
  HighchartAreaData,
  MessageStatistic,
  ModuleStatistic,
  ProcessStatistic,
  UserStatistic,
} from "@/types"

export async function getMessageStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_messages")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<MessageStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.num_messages])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}
export async function getTotalMessages(): Promise<number> {
  try {
    const { data } = await supabase
      .from("ao_metrics_messages")
      .select("*")
      .returns<MessageStatistic[]>()

    if (data) {
      return data.reduce((acc, curr) => {
        return acc + curr.num_messages
      }, 0)
    }

    return 0
  } catch (error) {
    console.error(error)
    return 0
  }
}

export async function getModuleStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_modules")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<ModuleStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.modules_running])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getUserStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_users")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<UserStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.users])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getProcessStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_processes ")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<ProcessStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.processes])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}
