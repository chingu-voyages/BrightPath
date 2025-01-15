import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { expect, describe, it } from '@jest/globals' 
import Home from '@/app/page'

describe('Home', () => {
  it('renders without crashing', () => {
    expect(() => render(<Home />)).not.toThrow()
  })
})