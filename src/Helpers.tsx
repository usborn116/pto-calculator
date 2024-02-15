import { HrParam } from "./Types"
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

export const accrualTable: HrParam[]= [{rate: 3.34, max: 120},
    {rate: 3.76, max: 132},
    {rate: 4.0, max: 144},
    {rate: 4.34, max: 156},
    {rate: 4.67, max: 168},
    {rate: 5.0, max: 180}]