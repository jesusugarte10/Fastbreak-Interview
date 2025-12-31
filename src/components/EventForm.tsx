'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, type EventFormData } from '@/lib/validators/event'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VenueMultiInput } from './VenueMultiInput'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type EventFormProps = {
  defaultValues?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => Promise<{ ok: boolean; error?: string }>
  submitLabel?: string
}

const SPORTS = [
  'Basketball',
  'Football',
  'Soccer',
  'Baseball',
  'Tennis',
  'Volleyball',
  'Hockey',
  'Other',
]

export function EventForm({ defaultValues, onSubmit, submitLabel = 'Create Event' }: EventFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  // Convert ISO datetime to datetime-local format if present
  // This ensures datetime-local inputs receive the correct format (YYYY-MM-DDTHH:mm)
  // instead of ISO strings (YYYY-MM-DDTHH:mm:ssZ) which they cannot parse
  const convertedDefaultValues = React.useMemo(() => {
    const baseDefaults = {
      name: '',
      sport: '',
      dateTime: '',
      description: '',
      venueNames: [],
    }
    
    if (!defaultValues) {
      return baseDefaults
    }
    
    // Create a new object with all defaultValues, ensuring we don't mutate the original
    const converted: Partial<EventFormData> = {
      ...baseDefaults,
      ...defaultValues,
    }
    
    // Convert ISO datetime string to datetime-local format (YYYY-MM-DDTHH:mm)
    // This is critical because HTML datetime-local inputs cannot parse ISO strings with timezone
    if (converted.dateTime && typeof converted.dateTime === 'string') {
      try {
        // Check if it's already in datetime-local format (no timezone, no seconds)
        const isAlreadyLocalFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(converted.dateTime)
        
        if (!isAlreadyLocalFormat) {
          // Parse the ISO string and convert to local time
          const date = new Date(converted.dateTime)
          
          if (!isNaN(date.getTime())) {
            // Format as YYYY-MM-DDTHH:mm (datetime-local format)
            // Use local time components to ensure correct display in datetime-local input
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            
            // Explicitly set the converted value - this will NOT be overridden
            converted.dateTime = `${year}-${month}-${day}T${hours}:${minutes}`
          } else {
            // Invalid date, clear it
            converted.dateTime = ''
          }
        }
        // If already in correct format, keep it as-is
      } catch (error) {
        // If conversion fails, clear the value to avoid showing invalid data
        console.error('Failed to convert datetime:', error)
        converted.dateTime = ''
      }
    } else if (converted.dateTime === null || converted.dateTime === undefined) {
      // Ensure empty string for null/undefined
      converted.dateTime = ''
    }
    
    return converted
  }, [defaultValues])
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: convertedDefaultValues,
  })

  const handleSubmit = (data: EventFormData) => {
    startTransition(async () => {
      const result = await onSubmit(data)
      if (result.ok) {
        toast.success(submitLabel.includes('Update') ? 'Event updated successfully' : 'Event created successfully')
        router.push('/dashboard')
        router.refresh()
      } else {
        form.setError('root', { message: result.error || 'An error occurred' })
        toast.error(result.error || 'An error occurred')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Summer Basketball Championship" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Event description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venueNames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venues</FormLabel>
              <FormControl>
                <VenueMultiInput
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.venueNames?.message}
                />
              </FormControl>
              <FormDescription>Add at least one venue for this event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  )
}