import { useState } from 'react'
import './App.css'

const restOfYear = (day: number) => {
  const curr: Date = new Date()
  const date = new Date(curr.getFullYear(), curr.getMonth(), day)
  const arr: Date[] = []
  for (let i = date.getMonth(); i < 12; i++){
    arr.push(new Date(curr.getFullYear(), i, day))
    date.setMonth(date.getMonth() + 1)
  }
  return arr
}

type hrParam = {
  rate: number,
  max: number
}

type dateLog = {
  date: Date,
  hrs: number,
  payday: boolean,
  overMax: boolean
}

type formSubmission = {
  target: { 
    name: string,
    value: string | number | Date 
  }
}

const accrualTable: hrParam[]= [{rate: 3.34, max: 120},
                {rate: 3.76, max: 132},
                {rate: 4.0, max: 144},
                {rate: 4.34, max: 156},
                {rate: 4.67, max: 168},
                {rate: 5.0, max: 180}]

const firsts = [...restOfYear(1), ...restOfYear(16)].sort((a, b) => a.getTime() - b.getTime())
if (new Date() > firsts[0]){ firsts.shift()}
const dates: dateLog[]= []
firsts.forEach(f => dates.push({date: f, hrs: 0, payday: true, overMax: false}))

function App() {
  const [years, setYears] = useState(0)
  const [currHrs, setCurrHrs] = useState(0)
  const [hrsArr, setHrsArr] = useState([...dates])
  const [added, setAdded] = useState<dateLog>({date: new Date(), hrs: 0, payday: false, overMax: false})

  const ptoParams = () => {
    const acc = accrualTable[years]['rate']
    hrsArr[0]['hrs'] = currHrs
    console.log('pre', hrsArr)
    for (let i = 1; i < hrsArr.length; i++){
      let num = null
      if (hrsArr[i]['payday'] == true){
        num = Number(hrsArr[i - 1]['hrs'] + acc).toFixed(2)
      } else {
        num = Number(hrsArr[i - 1]['hrs'] + hrsArr[i]['hrs']).toFixed(2)
      }
      hrsArr[i]['hrs'] = Number(num)
      if (Number(num) > accrualTable[years]['max']) hrsArr[i]['overMax'] = true
    }
    setHrsArr([...hrsArr])
  }

  const table = (
    <div className="table">
      <div className='col'>
        <h2>Date</h2>
        {hrsArr.map((f, i) => <div key={i}>{f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</div>)}
      </div>
      <div className='col'>
        <h2>Hours</h2>
        {hrsArr.map((f, i) => <div key={i} className={f.overMax ? 'over' : ''}>{f.hrs}</div>)}
      </div>
    </div>
  )

  const handleChange = async (e: formSubmission) => {
    const name = e.target.name
    const value = name == 'date' ? new Date(e.target?.value) : 0 - Number(e.target?.value)
    setAdded(values => ({...values, [name]: value}))
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
      <div className="card">
        <div className="pair">
        <label>Years @ Planning Center</label><br></br>
        <input type='number' onChange={(e) => setYears(() => Number(e.target.value))}/>
        </div>
        <div className="pair">
        <label>Current Vacation Hours</label><br></br>
        <input type='number' onChange={(e) => setCurrHrs(() => Number(e.target.value))}/>
        </div>
        <button onClick={() => ptoParams()}>Calculate Vacation Days!</button>
        <div className="form">
            <form onSubmit={handleSubmit}>
              <h2>Add a Vacation Day!</h2>
              <div className="pair">
              <label>Vacation Date</label><br></br>
              <input type="date" name="date" onChange={handleChange}/>
              </div>
              <div className="pair">
              <label>Hours Using</label><br></br>
              <input type="number" name="hrs" onChange={handleChange}/>
              </div>
              <input type="submit" value="Add it!"></input>
            </form>
        </div>
        {table}
        
      </div>
    </>
  )
}

export default App