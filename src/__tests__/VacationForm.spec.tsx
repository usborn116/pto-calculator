/**
 * @jest-environment jsdom
 */
import {render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

describe('renders correct hours', (): void => {
    render(<App />)
    const years = screen.getAllByRole('spinbutton')[0]
    const hrs = screen.getAllByRole('spinbutton')[1]
    const calculate = screen.getAllByRole('button')[0]
    expect(calculate).toBeDefined()
    expect(years).toBeDefined()
    expect(hrs).toBeDefined()
    it('sets correct initial hours', async ({expect}): Promise<void> => {
        await user.type(years, '5')
        expect(screen.queryByLabelText('Vacation Start Date')).toBeNull()
        await user.type(hrs, '150')
        await user.click(calculate)
        const fifteen = screen.getByText('150')
        expect(fifteen).toBeDefined()
        const twenty = screen.getByText('155')
        expect(twenty).toBeDefined()
        const twentyFive = screen.getByText('160')
        expect(twentyFive).toBeDefined()
    })

    it('adds vacation date fields and correct number of hour fields', async ({expect}): Promise<void> => {
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
    })
    
    it('adds correct number of hours fields', async ({expect}): Promise<void> => {
        const buttons2 = await screen.findAllByRole('spinbutton')
        const vhrs = buttons2[2]
        const vhrs2 = buttons2[3]
        const vhrs3 = buttons2[4]
        const vhrs4 = buttons2[5]
        await user.type(vhrs, '1')
        await user.type(vhrs2, '2')
        await user.type(vhrs3, '3')
        await user.type(vhrs4, '4')
        const add = screen.getByText('Add it!')
        await user.click(add)
        expect(screen.getByText('-1')).toBeDefined()     
        expect(screen.getByText('-2')).toBeDefined()     
        expect(screen.getByText('-3')).toBeDefined()     
        expect(screen.getByText('-4')).toBeDefined()       
    })
    

})