/**
 * @jest-environment jsdom
 */
import { restOfYear } from '../Helpers'
import {render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

describe('renders correct hours', () => {
    render(<App />)
    const years = screen.getAllByRole('spinbutton')[0]
    const hrs = screen.getAllByRole('spinbutton')[1]
    const vhrs = screen.getAllByRole('spinbutton')[2]
    const initDate = screen.getByLabelText('Vacation Start Date')
    const calculate = screen.getAllByRole('button')[0]
    const vacay = screen.getAllByRole('button')[1]
    expect(calculate).toBeDefined()
    expect(years).toBeDefined()
    expect(hrs).toBeDefined()
    it('sets correct initial hours', async ({expect}) => {
        await user.type(years, '5')
        expect(initDate).toBeNull()
        await user.type(hrs, '150')
        await user.click(calculate)
        const fifteen = screen.getByText('150')
        expect(fifteen).toBeDefined()
        const twenty = screen.getByText('155')
        expect(twenty).toBeDefined()
        const twentyFive = screen.getByText('160')
        expect(twentyFive).toBeDefined()
    })

    it('adds vacation date', async ({expect}) => {
        const curr = new Date()
        fireEvent.change(initDate, {target: {value: `${curr.getFullYear()}-${curr.getMonth()}-${curr.getDate() + 2}`}})
        await user.type(vhrs, '3')
        await user.click(vacay)
        expect(screen.getByText('-3')).toBeDefined()
    })

    it('does not go past the max hours', ({expect}) => {
        expect(screen.getAllByText('180').length).toBeGreaterThan(0)
        expect(screen.queryAllByText('185').length).toBe(0)
    })

})