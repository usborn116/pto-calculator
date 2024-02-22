/**
 * @jest-environment jsdom
 */
import { restOfYear } from '../Helpers'
import {render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

describe('creates correct dates', () => {
    const curr = new Date()
    const date = new Date(curr.getFullYear(), curr.getMonth(), 15)
    const arr = restOfYear(15)
    it('sets correct first date', ({expect}) => {
        expect(arr[0]).toEqual(date)
    })

    it('sets correct second date', ({expect}) => {
        expect(arr[1]).toEqual(new Date(curr.getFullYear(), curr.getMonth() + 1, 15))
    })

})

describe('renders correct accumulation and max numbers', async () => {
    render(<App />)
    const years = screen.getAllByRole('spinbutton')[0]
    expect(years).toBeDefined()
    it('gets it correct for 0 years at Planning Center', async ({expect}) => {
        await user.type(years, '0')
        const banner = screen.getByText('You accumulate 3.34 hours per pay period, up to 120 hours')
        expect(banner).toBeDefined()
    })

    it('gets it correct for 5 years at Planning Center', async ({expect}) => {
        await user.type(years, '5')
        const banner = screen.getByText('You accumulate 5 hours per pay period, up to 180 hours')
        expect(banner).toBeDefined()
    })
    
})


describe('renders correct hours', async () => {
    const years = screen.getAllByRole('spinbutton')[0]
    const hrs = screen.getAllByRole('spinbutton')[1]
    const vhrs = screen.getAllByRole('spinbutton')[2]
    const date = screen.getByLabelText('Vacation Date')
    const calculate = screen.getAllByRole('button')[0]
    const vacay = screen.getAllByRole('button')[1]
    expect(calculate).toBeDefined()
    expect(years).toBeDefined()
    expect(hrs).toBeDefined()
    expect(date).toBeDefined()
    it('sets correct initial hours', async ({expect}) => {
        await user.type(hrs, '15')
        await user.click(calculate)
        const fifteen = screen.getByText('15')
        expect(fifteen).toBeDefined()
        const twenty = screen.getByText('20')
        expect(twenty).toBeDefined()
        const twentyFive = screen.getByText('25')
        expect(twentyFive).toBeDefined()
    })

    it('adds vacation date', async ({expect}) => {
        const curr = new Date()
        fireEvent.change(date, {target: {value: `${curr.getFullYear()}-${curr.getMonth()}-${curr.getDate() + 2}`}})
        await user.type(vhrs, '3')
        await user.click(vacay)
        expect(screen.getByText('-3')).toBeDefined()
    })

    

})

