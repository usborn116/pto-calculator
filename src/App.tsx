import { useState, useRef } from 'react'
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
  hrs: number
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
firsts.forEach(f => dates.push({date: f, hrs: 0}))

console.log(firsts)

function App() {
  const [years, setYears] = useState(0)
  const [currHrs, setCurrHrs] = useState(0)
  const [hrsArr, setHrsArr] = useState([...dates])
  const [added, setAdded] = useState<dateLog>({date: new Date(), hrs: 0})

  const ptoParams = () => {
    const acc = accrualTable[years]['rate']
    hrsArr[0]['hrs'] = currHrs
    for (let i = 1; i < firsts.length; i++){
      const num = Number(hrsArr[i - 1]['hrs'] + acc).toFixed(2)
      hrsArr[i]['hrs'] = Number(num)
    }
    setHrsArr([...hrsArr])
  }

  const table = (
    <div className="table">
      <div className='col'>{hrsArr.map((f, i) => <div key={i}>{f.date.toDateString()}</div>)}
      </div>
      <div className='col'>{hrsArr.map((f, i) => <div key={i}>{f.hrs}</div>)}
      </div>
    </div>
  )

  const handleChange = async (e) => {
    const name = e.target.name
    const value = name == 'date' ? new Date(e.target?.value) : 0 - Number(e.target?.value)
    console.log(new Date(e.target?.value))
    setAdded(values => ({...values, [name]: value}))
    console.log(added)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    hrsArr.push(added)
    console.log(hrsArr)
    hrsArr.sort((a, b) => a.date.getTime() - b.date.getTime())
    ptoParams()
    setHrsArr([...hrsArr])
  }
  return (
    <>
      <h1>PTO Planner</h1>
      <div>
        It's {(new Date()).toDateString()}
      </div>
      <div className="card">
        <label>How many years have you been at Planning Center?</label><br></br>
        <input type='number' onChange={(e) => setYears(() => Number(e.target.value))}/><br></br>
        <label>How many hours of PTO do you currently have?</label><br></br>
        <input type='number' onChange={(e) => setCurrHrs(() => Number(e.target.value))}/>
        <button onClick={() => ptoParams()}>Calculate!</button>
        <div className="form">
            <form onSubmit={handleSubmit}>
              <label>Enter a vacation date</label><br></br>
              <input type="date" name="date" onChange={handleChange}/>
              <label>How many hours are you using?</label><br></br>
              <input type="number" name="hrs" onChange={handleChange}/>
              <input type="submit" value="Submit"></input>
            </form>
        </div>
        {table}
        
      </div>
    </>
  )
}

export default App

