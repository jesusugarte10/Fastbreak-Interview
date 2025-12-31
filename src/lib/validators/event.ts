import { z } from 'zod'

// Helper to transform empty/null values to undefined and trim whitespace
const optionalStringTransform = (maxLength: number) =>
  z
    .union([z.string().max(maxLength), z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      // Convert null/undefined/empty string to undefined
      // Trim whitespace and return undefined if empty
      if (!val || (typeof val === 'string' && !val.trim())) {
        return undefined
      }
      return typeof val === 'string' ? val.trim() : undefined
    })

export const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(200),
  sport: z.string().min(1, 'Sport type is required').max(100),
  dateTime: z.string().refine(
    (val) => {
      if (!val) return false
      // Convert datetime-local format (YYYY-MM-DDTHH:mm) to ISO string
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: 'Invalid date format' }
  ).transform((val) => {
    // Convert to ISO string for database storage
    return new Date(val).toISOString()
  }),
  description: optionalStringTransform(1000),
  location: optionalStringTransform(200),
  venueNames: z.array(z.string().min(1, 'Venue name cannot be empty')).min(1, 'At least one venue is required'),
})

export type EventFormData = z.infer<typeof eventSchema>
