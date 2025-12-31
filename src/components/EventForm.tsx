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
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      sport: '',
      dateTime: '',
      description: '',
      venueNames: [],
      ...defaultValues,
    },
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
