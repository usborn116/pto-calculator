
export type hrParam = {
    rate: number,
    max: number
  }
  
export type dateLog = {
    date: Date,
    hrs: number,
    payday: boolean,
    overMax: boolean,
    totalHrs: number
  }
  
export type formSubmission = {
    target: { 
      name: string,
      value: string | number | Date 
    }
  }

export const accrualTable: hrParam[]= [{rate: 3.34, max: 120},
    {rate: 3.76, max: 132},
    {rate: 4.0, max: 144},
    {rate: 4.34, max: 156},
    {rate: 4.67, max: 168},
    {rate: 5.0, max: 180}]