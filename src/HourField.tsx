import './App.css'
import { DateLog } from './Types';

interface Props {
    d: DateLog,
    i: number,
    fn: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
}

export const HourField = ({ d, i, fn }: Props) => {
    return (
        <div key={i} className="hr-pair">
            <label>{d.date.toLocaleDateString('en-us', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric'})} Hrs</label>
            <input type="number" max={8} name={`${i}-hrs`} onChange={fn}/>
        </div>
    )
}