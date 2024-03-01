/**
 * @jest-environment jsdom
 */
import {render, screen, fireEvent } from '@testing-library/react'
import { describe, it } from 'vitest'
import App from '../App'
import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

describe('renders correct hours', async () => {
    render(<App />)
    const years = screen.getAllByRole('spinbutton')[0]
    const hrs = screen.getAllByRole('spinbutton')[1]
    const calculate = screen.getAllByRole('button')[0]
    await user.type(years, '5')
    await user.type(hrs, '150')
    await user.click(calculate)
    
    it('correctly aggregates by 5', async ({expect}): Promise<void> => {
        const fifteen = screen.getByText('150')
        expect(fifteen).toBeDefined()
        const twenty = screen.getByText('155')
        expect(twenty).toBeDefined()
        const twentyFive = screen.getByText('160')
        expect(twentyFive).toBeDefined()
    })

    it('correctly subtracts vacation hours', async ({expect}): Promise<void> => {
        const curr = new Date()
        const later = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 3)
        const initDate = screen.getByLabelText('Vacation Start Date')
        expect(initDate).toBeDefined()
        const buttons = await screen.findAllByRole('spinbutton')
        expect(buttons.length).toBe(2)
        act(() => fireEvent.change(initDate, {target: {value: curr.toISOString().slice(0,10) }}))
        const endDate = screen.getByLabelText('Vacation End Date')
        expect(endDate).toBeDefined()
        act(() => fireEvent.change(endDate, {target: {value: later.toISOString().slice(0,10) }}))
        const buttons2 = await screen.findAllByRole('spinbutton')
        expect(buttons2.length).toBe(6)
        const vhrs = buttons2[2]
        const vhrs2 = buttons2[3]
        const vhrs3 = buttons2[4]
        const vhrs4 = buttons2[5]
        await user.type(vhrs, '1')
        await user.type(vhrs2, '2')
        await user.type(vhrs3, '4')
        await user.type(vhrs4, '3')
        const add = screen.getByText('Add it!')
        await user.click(add)
        expect(screen.getByText('-1')).toBeDefined()     
        expect(screen.getByText('-2')).toBeDefined()     
        expect(screen.getByText('-4')).toBeDefined()     
        expect(screen.getByText('-3')).toBeDefined()
        expect(screen.getByText('153')).toBeDefined()     
        expect(screen.getByText('149')).toBeDefined()     
        expect(screen.getByText('146')).toBeDefined()     
        expect(screen.getByText('151')).toBeDefined()
    })
    
    
    it('resets vacation days', async ({expect}): Promise<void> => {
        const reset = screen.getByText('Reset Vacation Days')
        expect(reset).toBeDefined()
        await user.click(reset)
        const fifteen = screen.getByText('150')
        expect(fifteen).toBeDefined()
        const twenty = screen.getByText('155')
        expect(twenty).toBeDefined()
        const twentyFive = screen.getByText('160')
        expect(twentyFive).toBeDefined()
        expect(screen.queryByText('-1')).toBe(null)
    })
    
    

})