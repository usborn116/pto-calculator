/**
 * @jest-environment jsdom
 */
import { restOfYear } from '../Helpers'
import {render, screen, fireEvent } from '@testing-library/react'
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
    })
    
})