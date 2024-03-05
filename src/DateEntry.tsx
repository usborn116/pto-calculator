import { useState } from 'react';
import './App.css'
import { DateLog } from './Types';
import edit from './assets/edit.svg'

interface Props {
    f: DateLog,
    i: number,
    resetDates: (arg1: Date) => void,
    editDates: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const DateEntry = ({ f, i, resetDates, editDates }: Props) => {

    const [editDate, setEditDate] = useState<boolean>(false)
    const [editHrs, setEditHrs] = useState<boolean>(false)

    if (editHrs){
        return (
            <div className="row editHourForm">
                <button className='delete' onClick={() =>  setEditHrs(false)}>Save</button>
                <div className="edit-pair"><p>{i == 0 ? "Today" : f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</p>{''}</div>
                <input type='number' name={`${i}-hrs`} defaultValue={f.hrs} onChange={editDates}/>
                <div className={`edit-pair ${f.overMax ? 'over' : ''}`}>{f.totalHrs}</div>
            </div>
        )
    } else if (editDate){
        return (
            <div className="row editHourForm">
                <button className='delete' onClick={() =>  setEditDate(false)}>Save</button>
                <input type="date" name={`${i}-date`} defaultValue={f.date.toISOString().slice(0, 10)} onBlur={editDates}/>
                <div className='edit-pair'>{f.hrs}</div>
                <div className={`edit-pair ${f.overMax ? 'over' : ''}`}>{f.totalHrs}</div>
            </div>
        )
    }

    return (
        <div className={`row ${f.overMax ? 'over' : ''} ${f.payday ? '' : 'vacay'}`} key={i}>
            { f.payday ? <div></div> : <button className='delete' onClick={() => resetDates(f.date)}>X</button>}
            <div className='edit-pair'>
                <p>{i == 0 ? "Today" : f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</p>
                {f.payday ? '' : <img className='list-logo delete' src={edit} onClick={() => setEditDate(true)}></img>}
            </div>
            <div className="edit-pair">
                <p>{f.hrs}</p>
                {f.payday ? '' : <img className='list-logo delete' src={edit} onClick={() => setEditHrs(true)}></img>}
            </div>
          <div className={`edit-pair ${f.overMax ? 'over' : ''}`}>{f.totalHrs}</div>
        </div>
    )
}

//<input type="date" name={`${i}-date`} defaultValue={f.date.toISOString().slice(0, 10)} onChange={editDates}/>