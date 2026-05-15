import { z } from 'zod'

export const decodeTextSchema = z.object({
  text: z.string().min(1, 'Paste some text to decode').max(5000),
})

export type DecodeTextInput = z.infer<typeof decodeTextSchema>
