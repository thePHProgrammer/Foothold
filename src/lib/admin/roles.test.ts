import { describe, expect, it } from 'vitest'

import { isValidRole, ROLES } from '@/lib/admin/roles'

describe('isValidRole', () => {
  it('accepts the two known roles', () => {
    expect(isValidRole('user')).toBe(true)
    expect(isValidRole('admin')).toBe(true)
  })

  it('rejects unknown role strings', () => {
    expect(isValidRole('owner')).toBe(false)
    expect(isValidRole('superadmin')).toBe(false)
    expect(isValidRole('')).toBe(false)
  })

  it('rejects non-string values', () => {
    expect(isValidRole(null)).toBe(false)
    expect(isValidRole(undefined)).toBe(false)
    expect(isValidRole(0)).toBe(false)
    expect(isValidRole({})).toBe(false)
  })

  it('exposes ROLES as a stable readonly tuple', () => {
    expect(ROLES).toEqual(['user', 'admin'])
  })
})
