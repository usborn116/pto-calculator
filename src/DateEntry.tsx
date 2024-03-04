import { useState } from 'react';
import './App.css'
import { DateLog } from './Types';

interface Props {
    f: DateLog,
    i: number,
    resetDates: (arg1: Date) => void,

}

export const DateEntry = ({ f, i, resetDates }: Props) => {

    const [edit, setEdit] = useState<boolean>(false)

    if (edit){
        return (
            <div className={`row ${f.overMax ? 'over' : ''} ${f.payday ? '' : 'vacay'}`} key={i}>
                <div>{i == 0 ? "Today" : f.date.toLocaleDateString('en-us', { timeZone: 'UTC'})}</div>
                <div>{f.hrs}</div>
                <div className={f.overMax ? 'over' : ''}>{f.totalHrs}</div>
                { f.payday ? '' : <button className='delete' onClick={() => resetDates(f.date)}>X</button>}
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