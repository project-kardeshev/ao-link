import { redirect } from "next/navigation"

import { getMessageById } from "@/services/messages-api"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"

type EntityPageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function EntityPageServer(props: EntityPageServerProps) {
  const { slug: entityId } = props.params

  const message = await getMessageById(entityId)

  if (!message) {
    return <UserPage entityId={entityId} />
  }

  if (message.type === "Process") {
    return <ProcessPage message={message} />
  }

  return redirect(`/message/${entityId}`)
}
