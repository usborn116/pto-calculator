/**
 * @jest-environment jsdom
 */
import { restOfYear } from '../Helpers'
import {render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()