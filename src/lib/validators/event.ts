import { z } from 'zod'

export const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(200),
  sport: z.string().min(1, 'Sport type is required').max(100),
  dateTime: z.string().datetime('Invalid date format'),
  description: z.string().max(1000).optional(),
  venueNames: z.array(z.string().min(1, 'Venue name cannot be empty')).min(1, 'At least one venue is required'),
})

export type EventFormData = z.infer<typeof eventSchema>
