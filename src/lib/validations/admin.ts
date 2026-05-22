import { z } from 'zod'

import { ROLES } from '@/lib/admin/roles'

export const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(ROLES),
})

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
