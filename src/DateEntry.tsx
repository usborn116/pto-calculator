import { useState } from 'react';
import './App.css'
import { DateLog } from './Types';

interface Props {
    f: DateLog,
    i: number,
    resetDates: (arg1: Date) => void,
    editDates: (e: React.ChangeEvent<HTMLInputElement>) => void,
    ptoParams: () => void
}

export const DateEntry = ({ f, i, resetDates, editDates }: Props) => {

    const [edit, setEdit] = useState<boolean>(false)

    if (edit){
        return (
            <div className="editHourForm">
                <div>{i == 0 ? "Today" : f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</div>
                <input type='number' name={`${i}-hrs`} defaultValue={f.hrs} onChange={editDates}/>
                <div className={f.overMax ? 'over' : ''}>{f.totalHrs}</div>
                { f.payday ? '' : <button className='delete' onClick={() => resetDates(f.date)}>X</button>}
                <button className='delete' onClick={() => setEdit(false)}>Save</button>
            </div>
        )
    }

    return (
        <div className={`row ${f.overMax ? 'over' : ''} ${f.payday ? '' : 'vacay'}`} key={i}>
          <div>{i == 0 ? "Today" : f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</div>
          <div>{f.hrs}</div>
          <div className={f.overMax ? 'over' : ''}>{f.totalHrs}</div>
          { f.payday ? '' : <button className='delete' onClick={() => resetDates(f.date)}>X</button>}
          { f.payday ? '' : <button className='delete' onClick={() => setEdit(true)}>Edit</button>}
        </div>
    )
}

//<input type="date" name={`${i}-date`} defaultValue={f.date.toISOString().slice(0, 10)} onChange={editDates}/>