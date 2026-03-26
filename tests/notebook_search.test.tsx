import { render, screen, fireEvent } from '@testing-library/react'
import NotebookSearch from '../src/components/NotebookSearch'
import { describe, it, expect, vi } from 'vitest'

describe('NotebookSearch', () => {
  it('renders the search input', () => {
    render(<NotebookSearch />)
    const input = screen.getByPlaceholderText(/Consultar o manuscrito.../i)
    expect(input).toBeDefined()
  })

  it('shows searching state when clicking search button', async () => {
    render(<NotebookSearch />)
    const input = screen.getByPlaceholderText(/Consultar o manuscrito.../i)
    const button = screen.getByRole('button', { name: /Consultar/i })
    
    fireEvent.change(input, { target: { value: 'Quem escalar na rodada 9?' } })
    fireEvent.click(button)
    
    const status = await screen.findByText(/Analisando o manuscrito.../i)
    expect(status).toBeDefined()
  })
})
