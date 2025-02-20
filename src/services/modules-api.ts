
export async function getModuleBinary(moduleId: string) {
  const res = await fetch(`https://arweave.net/${moduleId}`)
  return res.arrayBuffer()
}
