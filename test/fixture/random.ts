export const randomPick = <T>(list: T[], n: number) => {
  if (n > list.length) throw Error
  const shuffle = (list: T[]) => list.sort(() => Math.random() - 0.5)
  return shuffle(list).slice(0, n)
}