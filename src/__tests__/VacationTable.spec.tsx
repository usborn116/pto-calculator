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
        const start = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 1)
        const later = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 4)
        const initDate = screen.getByLabelText('Vacation Start')
        expect(initDate).toBeDefined()
        const buttons = await screen.findAllByRole('spinbutton')
        expect(buttons.length).toBe(2)
        act(() => fireEvent.change(initDate, {target: {value: start.toISOString().slice(0,10) }}))
        const endDate = screen.getByLabelText('Vacation End')
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
        await user.type(vhrs3, '3')
        await user.type(vhrs4, '6')
        const add = screen.getByText('Add it!')
        await user.click(add)
        expect(screen.getByText('-1')).toBeDefined()     
        expect(screen.getByText('-2')).toBeDefined()     
        expect(screen.getByText('-3')).toBeDefined()     
        expect(screen.getByText('-6')).toBeDefined()
        expect(screen.queryAllByText('149').length).toBeGreaterThan(0)   
    })
    
    
    it('deletes single vacation day and calculates accordingly', async ({expect}): Promise<void> => {
        const deletes = screen.getAllByText('X')
        const delete2 = deletes[1]
        expect(delete2).toBeDefined()
        await user.click(delete2)
        expect(screen.queryByText('-2')).toBe(null)
        expect(screen.queryByText('-3')).toBeDefined()
    })

    it('edits a single vacation day hours and calculates accordingly', async ({expect}): Promise<void> => {
        const edits = screen.getAllByRole('img')
        const edit1 = edits[4]
        expect(edit1).toBeDefined()
        await user.click(edit1)
        const hrField = screen.getAllByRole('spinbutton')[2]
        await user.clear(hrField)
        await user.type(hrField, '-5')
        await user.click(screen.getByText('Save'))
        expect(screen.queryByText('-3')).toBe(null)
        expect(screen.queryByText('-5')).toBeDefined()
    })

    it('edits a single vacation date and calculates accordingly', async ({expect}): Promise<void> => {
        const curr = new Date()
        const testDate = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 16)
        curr.setDate(curr.getDate() + 16)
        const edits = screen.getAllByRole('img')
        const edit1 = edits[3]
        expect(edit1).toBeDefined()
        await user.click(edit1)
        const saves = screen.getAllByText('Save')
        const save = saves[0]
        expect(save).toBeDefined()
        const dateField = screen.getByAltText('dateField')
        expect(dateField).toBeDefined()
        dateField.focus()
        fireEvent.change(dateField, {target: {value: testDate.toISOString().slice(0,10) }})
        save.focus()
        await user.click(save)
        expect(screen.getByText(`${testDate.toLocaleDateString('en-us', { timeZone: 'UTC'})}`)).toBeDefined()
        expect(screen.queryByText('-5')).toBeDefined()
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