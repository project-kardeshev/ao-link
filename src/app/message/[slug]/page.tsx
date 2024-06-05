import { getMessageById } from "@/services/messages-api"

import { MessagePage } from "./MessagePage"

type MessagePageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function MessagePageServer(props: MessagePageServerProps) {
  const { slug: messageId } = props.params

  const message = await getMessageById(messageId)

  if (!message) {
    return <div>Not Found</div>
  }

  // TODO move inside
  let data = ""
  try {
    const dataResponse = await fetch(`https://arweave.net/${messageId}`)
    data = await dataResponse.text()
  } catch (error) {
    console.log("Arweave.net error:", error)
  }

  return <MessagePage message={message} data={data} />
}
