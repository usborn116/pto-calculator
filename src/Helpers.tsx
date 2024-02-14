export const restOfYear = (day: number) => {
    const curr: Date = new Date()
    const date: Date = new Date(curr.getFullYear(), curr.getMonth(), day)
    const arr: Date[] = []
    for (let i = date.getMonth(); i < 12; i++){
      arr.push(new Date(curr.getFullYear(), i, day))
      date.setMonth(date.getMonth() + 1)
    }
    return arr
}