import { useState, useEffect } from 'react'
import './App.css'
import { DateLog, StartEndDate } from './Types'
import { restOfYear, accrualTable } from './Helpers'

const firsts = [...restOfYear(1), ...restOfYear(16)].sort((a, b) => a.getTime() - b.getTime()).filter((date) => date > new Date())

if (new Date().getDay() != firsts[0].getDay()) firsts.unshift(new Date())

const dates: DateLog[] = []

firsts.forEach(f => dates.push({date: f, hrs: 0, payday: true, overMax: false, totalHrs: 0}))

function App() {
  const [years, setYears] = useState<number>(-1)
  const [currHrs, setCurrHrs] = useState<number>(-1)
  const [hrsArr, setHrsArr] = useState<DateLog[]>([...dates])
  const [added, setAdded] = useState<DateLog[]>([])
  const [startEnd, setStartEnd] = useState<StartEndDate>({start: null, end: null})

  const ptoParams = () => {
    const acc = accrualTable[years]['rate']
    hrsArr[0]['totalHrs'] = currHrs
    for (let i = 1; i < hrsArr.length; i++){
      if (hrsArr[i]['payday'] == true) hrsArr[i]['hrs'] = acc
      hrsArr[i]['totalHrs'] = Number((hrsArr[i]['hrs'] + hrsArr[i - 1]['totalHrs']).toFixed(2))
      if (hrsArr[i]['totalHrs'] > accrualTable[years]['max']){
        hrsArr[i]['totalHrs'] = accrualTable[years]['max']
        hrsArr[i]['overMax'] = true
       } else {
        hrsArr[i]['overMax'] = false
       }
    }
    setHrsArr([...hrsArr])
  }

  useEffect(() => {
    if (startEnd.start && startEnd.end){
      const date = new Date(startEnd.start)
      const newAdded = []
      while (date <= startEnd.end){
        newAdded.push({date: new Date(new Date(date).toLocaleDateString('en-us', { timeZone: 'UTC'})), hrs: 0, payday: false, overMax: false, totalHrs: 0})  
        date.setDate(date.getDate() + 1)
      }
      setAdded([...newAdded])
    }
  }, [startEnd])

  const table = (
    <div className="table">
      <div className="row" id="header">
        <h2>Date</h2>
        <h2>Hours</h2>
        <h2>Total</h2>
      </div>
      {hrsArr.map((f, i) => (
        <div className={`row ${f.overMax ? 'over' : ''} ${f.payday ? '' : 'vacay'}`} key={i}>
          <div>{i == 0 ? "Today" : f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</div>
          <div>{f.hrs}</div>
          <div className={f.overMax ? 'over' : ''}>{f.totalHrs}</div>
        </div>
        )
      )}
    </div>
  )

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.name.split('-')[0]
    const value = 0 - Number(e.target?.value)
    added[Number(id)]['hrs'] = value
    setAdded([...added])
  }

  const handleStartEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    const value = new Date(new Date(target?.value).toLocaleDateString('en-us', { timeZone: 'UTC'}))
    const insert = {[name]: value}
    setStartEnd(values => ({...values, ...insert}))
  }

  const resetButton = () => {
    (document.getElementById('vacayform') as HTMLFormElement).reset();
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    added.forEach(a => hrsArr.push(a))
    hrsArr.sort((a, b) => a.date.getTime() - b.date.getTime())
    ptoParams()
    setAdded([])
    setHrsArr([...hrsArr])
    setStartEnd({start: null, end: null})
    resetButton()
  }

  const hrs = () => (added.map((d, i) => (
    <div key={i} className="hr-pair">
      <label>{d.date.toLocaleDateString('en-us', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric'})} Hrs</label>
      <input type="number" max={8} name={`${i}-hrs`} onChange={handleChange}/>
    </div>
  ))
  )

  const endDate = startEnd.start ? 
    <div className="pair">
      <label htmlFor="end">Vacation End Date</label>
      <input type="date" name="end" id="end" onChange={handleStartEndChange}/>
    </div> : ''

  return (
    <>
      <h1>Vacation Planner</h1>
      <h3>Enter some possible vacation days and see how it affects your accumulated vacation hours over time.</h3>
      <div className="layout">
      <div className="card">
        <h2>Initial Information</h2>
        <p>Enter some initial info to see how your vacation time will accrue for the rest of the year!</p>
        <div className="pair">
        <label>Years @ Planning Center</label><br></br>
        <input type='number' onChange={(e) => setYears(() => Number(e.target.value) > 5 ? 5 : Number(e.target.value))}/>
        </div>
        <div className="pair">
        <label>Current Vacation Hours</label><br></br>
        <input type='number' onChange={(e) => setCurrHrs(() => Number(e.target.value))}/>
        </div>
        <button onClick={() => ptoParams()}>Calculate Accrual!</button>
        { years > -1 ? 
        <div className='banner'>You accumulate {accrualTable[years]['rate']} hours per pay period, up to {accrualTable[years]['max']} hours</div> :
        ''
        }
        { years > -1 && currHrs > -1 &&
        <>
        <div className="form">
            <form onSubmit={handleSubmit} id='vacayform'>
              <h2>Add Vacation!</h2>

              <div className="pair">
              <label htmlFor="start">Vacation Start Date</label>
              <input type="date" name="start" id="start" onChange={handleStartEndChange}/>
              </div>
              {endDate}
              {hrs()}
              <input type="submit" value="Add it!"></input>
            </form>
        </div>
        <div className="key">
          <div className='over'>Over Max Limit</div>
          <div className='vacay'>Vacation Day!</div>
        </div>
        </>
        }
      </div>
        {table}
      </div> 
    </>
  )
}

export default App