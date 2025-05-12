import { card } from '../card.js'

describe('card function', () => {
  test('should return true when input is "valid"', () => {
    expect(card('valid')).toBe(true)
  })

  test('should return false when input is not "valid"', () => {
    expect(card('invalid')).toBe(false)
    expect(card('')).toBe(false)
    expect(card(null)).toBe(false)
    expect(card(undefined)).toBe(false)
  })
})
