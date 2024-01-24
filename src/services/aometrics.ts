"use server";

import { supabase } from "@/lib/supabase";
//@ts-ignore
const normalize = (data) => {
  let count = 0;
  //@ts-ignore
  const mapedData = data?.map((i) => {
    const data = {
      value: 0,
      date: "",
    };
    if ("num_messages" in i) {
      data.value = i.num_messages;
      data.date = i.created_date;
      count += i.num_messages;
    } else if ("modules_running" in i) {
      data.value = i.modules_running;
      data.date = i.created_date;
      count += i.modules_running;
    } else if ("users" in i) {
      data.value = i.users;
      data.date = i.created_date;
      count += i.users;
    } else if ("processes" in i) {
      data.value = i.processes;
      data.date = i.created_date;
      count += i.processes;
    }
    return data;
  });
  return {
    data: mapedData,
    count,
  };
};

export const metricsMessages = async (): Promise<any> => {
  try {
    const { data } = await supabase.from("ao_metrics_messages").select("*");

    if (data) {
      return normalize(data);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const metricsModules = async (): Promise<any> => {
  try {
    const { data } = await supabase.from("ao_metrics_modules").select("*");

    if (data) {
      return normalize(data);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const metricsUsers = async (): Promise<any> => {
  try {
    const { data } = await supabase.from("ao_metrics_users").select("*");

    if (data) {
      return normalize(data);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const metricsProcesses = async (): Promise<any> => {
  try {
    const { data } = await supabase.from("ao_metrics_processes ").select("*");

    if (data) {
      return normalize(data);
    }

    return null;
  } catch (error) {
    return null;
  }
};
