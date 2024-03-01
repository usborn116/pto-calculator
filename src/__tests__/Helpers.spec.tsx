/**
 * @jest-environment jsdom
 */
import { restOfYear } from '../Helpers'
//import {render, screen, fireEvent } from '@testing-library/react'
import { describe, it } from 'vitest'
//import App from '../App'
//import userEvent from '@testing-library/user-event'

//const user = userEvent.setup()

describe('creates correct dates', async (): Promise<void> => {
    const curr = new Date()
    const date = new Date(curr.getFullYear(), curr.getMonth(), 15)
    const arr = restOfYear(15)
    it('sets correct first date', ({expect}): void => {
        expect(arr[0]).toEqual(date)
    })

    it('sets correct second date', ({expect}): void => {
        expect(arr[1]).toEqual(new Date(curr.getFullYear(), curr.getMonth() + 1, 15))
    })

})

