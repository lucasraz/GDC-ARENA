import { render, screen } from '@testing-library/react'
import CartolaSquad from '../src/components/CartolaSquad'
import EliteCommand from '../src/components/EliteCommand'
import { describe, it, expect } from 'vitest'

const mockSquad = [
    { pos: 'GOL', name: 'Raul', club: 'BOT', price: 4.81 },
    { pos: 'LAT', name: 'Bernabéi', club: 'INT', price: 11.0 }
]

describe('Cartola Components', () => {
    describe('CartolaSquad', () => {
        it('renders source name and strategy', () => {
            render(<CartolaSquad name="Test Source" strategy="Test Strategy" highlights={["Point 1"]} />)
            expect(screen.getByText(/Test Source/i)).toBeDefined()
            expect(screen.getByText(/Test Strategy/i)).toBeDefined()
            expect(screen.getByText(/Point 1/i)).toBeDefined()
        })
    })

    describe('EliteCommand', () => {
        it('renders titles and prices correctly', () => {
            render(<EliteCommand title="Elite Title" description="Elite Desc" total_cost={120.34} squad={mockSquad} />)
            expect(screen.getByText(/Elite Title/i)).toBeDefined()
            expect(screen.getByText(/C\$ 120.34/i)).toBeDefined()
            expect(screen.getByText(/Bernabéi/i)).toBeDefined()
        })
    })
})
