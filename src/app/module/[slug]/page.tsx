import { getMessageById } from "@/services/messages-api"

import { ModulePage } from "./ModulePage"

type BlockPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function BlockPage(props: BlockPageProps) {
  const { slug: moduleId } = props.params

  const message = await getMessageById(moduleId)

  if (!message) {
    return <div>Not Found</div>
  }

  return <ModulePage message={message} />
}
