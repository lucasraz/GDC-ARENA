import { render, screen } from '@testing-library/react'
import TacticalField from '../src/components/TacticalField'
import { describe, it, expect } from 'vitest'

const mockSquad = [
    { pos: 'GOL', name: 'Raul', club: 'BOT', price: 4.81 },
    { pos: 'LAT', name: 'Bernabéi', club: 'INT', price: 11.0 },
    { pos: 'ATA', name: 'Neymar', club: 'SAN', price: 19.0 }
]

describe('TacticalField', () => {
    it('renders the football field container', () => {
        render(<TacticalField squad={mockSquad} />)
        const field = screen.getByRole('presentation', { name: /football pitch/i })
        expect(field).toBeDefined()
    })

    it('renders player names on the field', () => {
        render(<TacticalField squad={mockSquad} />)
        expect(screen.getByText(/Neymar/i)).toBeDefined()
        expect(screen.getByText(/Raul/i)).toBeDefined()
    })
})
