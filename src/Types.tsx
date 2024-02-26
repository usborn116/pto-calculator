
export type HrParam = {
    rate: number,
    max: number
  }
  
export type DateLog = {
    date: Date,
    hrs: number,
    payday: boolean,
    overMax: boolean,
    totalHrs: number
  }

export type StartEndDate = {
  start: Date | null,
  end: Date | null
}