import { useState } from 'react'
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
    const name = e.target.name
    const value = name == 'date' ? new Date(e.target?.value) : 0 - Number(e.target?.value)
    setAdded(values => ({...values, [name]: value}))
  }

  const handleStartEndChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = new Date(new Date(e.target?.value).toLocaleDateString('en-us', { timeZone: 'UTC'}))
    setStartEnd(values => ({...values, [name]: value}))
  }

  if (startEnd.start && startEnd.end){
    const date = startEnd.start
    while (date <= startEnd.end){
      added.push({date: new Date(new Date(date).toLocaleDateString('en-us', { timeZone: 'UTC'})), hrs: 0, payday: false, overMax: false, totalHrs: 0})
      date.setDate(date.getDate() + 1)
    }
    console.log('added', added)
  } else {
    console.log('not yet')
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    hrsArr.push(added)
    hrsArr.sort((a, b) => a.date.getTime() - b.date.getTime())
    ptoParams()
    setHrsArr([...hrsArr])
  }

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
        <div className="form">
            <form onSubmit={handleSubmit}>
              <h2>Add a Vacation Day!</h2>

              <div className="pair">
              <label htmlFor="start">Vacation Start Date</label><br></br>
              <input type="date" name="start" id="start" onChange={handleStartEndChange}/>
              </div>

              <div className="pair">
              <label htmlFor="end">Vacation End Date</label><br></br>
              <input type="date" name="end" id="end" onChange={handleStartEndChange}/>
              </div>

              <div className="pair">
              <label>Hours</label><br></br>
              <input type="number" max={8} name="hrs" onChange={handleChange}/>
              </div>
              <input type="submit" value="Add it!"></input>
            </form>
        </div>
        <div className="key">
          <div className='over'>Over Max Limit</div>
          <div className='vacay'>Vacation Day!</div>
        </div>
      </div>
        {table}
      </div> 
    </>
  )
}

export default App