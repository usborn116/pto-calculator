/**
 * @jest-environment jsdom
 */
import {render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

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
        expect(await screen.queryByText('Add Vacation!')).toBeNull()
    })

    const hrs = screen.getAllByRole('spinbutton')[1]
    const populate = screen.getAllByRole('button')[0]

    it('populates the table', async ({expect}) => {
        await user.type(hrs, '5')
        expect(await screen.queryByText('Add Vacation!')).toBeDefined()
        await user.click(populate)
        expect(screen.getByText('10')).toBeDefined()
        expect(screen.getByText('15')).toBeDefined()
        expect(screen.getByText('20')).toBeDefined()
    })

    it('respects the max', async ({expect}) => {
        await user.clear(hrs)
        await user.type(hrs, '170')
        await user.click(populate)
        expect(screen.getByText('170')).toBeDefined()
        expect(screen.getByText('175')).toBeDefined()
        expect(screen.getAllByText('180')).toBeDefined()
        expect(screen.queryByText('185')).toBeNull()
    })
    
})