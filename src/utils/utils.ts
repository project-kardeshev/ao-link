export function wait(time: number): Promise<null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), time))
}

export function timeout(time: number) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), time))
}
