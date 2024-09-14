export function nowInS() {
  return Math.floor(Date.now() / 1000)
}

export function dateInS(date: string) {
  return Math.floor(new Date(date).getTime() / 1000)
}
