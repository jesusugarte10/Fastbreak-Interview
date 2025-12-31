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
import { Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { generateEventDescriptionAction, generateEventSuggestionsAction } from '@/lib/actions/ai'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  'Pickleball',
  'Other',
]

export function EventForm({ defaultValues, onSubmit, submitLabel = 'Create Event' }: EventFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const router = useRouter()
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      sport: '',
      dateTime: defaultValues?.dateTime 
        ? new Date(defaultValues.dateTime).toISOString().slice(0, 16)
        : '',
      description: '',
      location: '',
      venueNames: [],
      ...defaultValues,
    },
  })

  const handleGenerateDescription = async () => {
    const eventName = form.getValues('name')
    const sport = form.getValues('sport')
    const location = form.getValues('location')

    if (!eventName || !sport) {
      toast.error('Please fill in event name and sport first')
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateEventDescriptionAction(eventName, sport, location)
      if (result.ok && result.data) {
        form.setValue('description', result.data)
        toast.success('✨ AI description generated and added!', {
          description: 'You can edit it if needed',
        })
      } else {
        toast.error('error' in result ? result.error : 'Failed to generate description')
      }
    } catch (error) {
      toast.error('Failed to generate description. Please check your API key.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSuggestions = async () => {
    const sport = form.getValues('sport')
    if (!sport) {
      toast.error('Please select a sport first')
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateEventSuggestionsAction(sport)
      if (result.ok && result.data && result.data.length > 0) {
        setSuggestions(result.data)
        setSuggestionsOpen(true)
        toast.success('Suggestions generated!')
      } else {
        toast.error('error' in result ? result.error : 'Failed to generate suggestions')
      }
    } catch (error) {
      toast.error('Failed to generate suggestions')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    form.setValue('name', suggestion)
    setSuggestionsOpen(false)
    toast.success('Event name selected!')
  }

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
              <div className="flex items-center justify-between">
                <FormLabel>Event Name</FormLabel>
                {form.watch('sport') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating}
                    className="h-7 text-xs"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {isGenerating ? 'Generating...' : 'AI Suggestions'}
                  </Button>
                )}
              </div>
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="City, State or Address" {...field} />
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
              <div className="flex items-center justify-between">
                <FormLabel>Description (Optional)</FormLabel>
                {form.watch('name') && form.watch('sport') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="h-7 text-xs"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                  </Button>
                )}
              </div>
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

      <Dialog open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Event Name Suggestions
            </DialogTitle>
            <DialogDescription>
              Click on a suggestion to use it as your event name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className="font-medium">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  )
}
