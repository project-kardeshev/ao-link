"use client";
import { aoEvents } from "@/services/aoscan";
import { transformArrayElements } from "@/utils/transformEvents";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const DataTable = () => {
  const [data, setData] = useState<
    | {
        id: string;
        type: string;
        messageId: string;
        processId: string;
        owner: string;
        blockHeight: number;
        schedulerId: string;
        created: string;
        nonce: number;
      }[]
    | []
  >([]);

  useEffect(() => {
    const getUserInfo = async () => {
      const events = await aoEvents();
      if (events) setData(transformArrayElements(events));
    };
    getUserInfo();
  }, []);

  return (
    <div className="overflow-x-auto mt-[70px] p-10">
      <table className="min-w-full">
        <thead className="table-headers">
          <tr>
            <th className="text-start p-2">Type</th>
            <th className="text-start p-2">Message ID</th>
            <th className="text-start p-2">Process ID</th>
            <th className="text-start p-2">Scheduler ID</th>
            <th className="text-start p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className="table-row" key={item.id}>
              <td>
                <div className="flex gap-2">
                  <p>{item.type}</p>
                </div>
              </td>
              <td className="text-start p-2 ">{item.messageId}</td>
              <td className="text-start p-2 ">{item.processId}</td>
              <td className="text-start p-2 ">{item.schedulerId}</td>
              <td className="text-start p-2 ">{item.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
