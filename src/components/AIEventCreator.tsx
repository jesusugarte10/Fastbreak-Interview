'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, Sparkles, Loader2, X } from 'lucide-react'
import { createEventWithAIAction } from '@/lib/actions/ai'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type EventData = {
  name?: string
  sport?: string
  dateTime?: string
  location?: string
  description?: string
  venueNames?: string[]
  isRecurring?: boolean
  recurrencePattern?: string
}

export function AIEventCreator() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI sports event assistant. I can ONLY help you create sports events. Just tell me what you need! For example:\n\n• \"Create a basketball tournament next Saturday at 2 PM\"\n• \"I want a weekly soccer practice every Monday at 6 PM\"\n• \"Plan a tennis championship on March 15th\"\n\nWhat sports event would you like to create?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedEvent, setExtractedEvent] = useState<EventData | null>(null)
  const router = useRouter()

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      const result = await createEventWithAIAction([
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ])

      if (result.ok && result.data) {
        const { response, eventData } = result.data

        // Add assistant response
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // If event data is extracted and has required fields, show confirmation
        if (eventData && Object.keys(eventData).length > 0) {
          // Only show extraction if we have at least name, sport, or dateTime
          if (eventData.name || eventData.sport || eventData.dateTime) {
            setExtractedEvent(eventData)
          }
        }
      } else {
        const error = 'error' in result ? result.error : 'Unknown error'
        let errorMessage = ''
        
        if (error.includes('API key') || error.includes('not configured')) {
          errorMessage = "I'm having trouble connecting to the AI service. Please check that the Gemini API key is configured in your environment variables."
        } else if (error.includes('model not found') || error.includes('404')) {
          errorMessage = "I'm having trouble with the AI service configuration. Please check your Gemini API settings and model access."
        } else {
          errorMessage = `I encountered an error: ${error}. Could you try rephrasing your request or providing more details about the sports event?`
        }
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check your API configuration.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!extractedEvent) return

    if (!extractedEvent.name || !extractedEvent.sport || !extractedEvent.dateTime) {
      toast.error('Missing required fields. Please provide event name, sport, and date/time.')
      return
    }

    setIsProcessing(true)
    try {
      const { createEventAction } = await import('@/lib/actions/events')
      
      // Convert extracted data to form data format
      const formData = {
        name: extractedEvent.name,
        sport: extractedEvent.sport,
        dateTime: extractedEvent.dateTime,
        description: extractedEvent.description,
        location: extractedEvent.location,
        venueNames: extractedEvent.venueNames || [],
      }

      const result = await createEventAction(formData)
      
      if (result.ok) {
        toast.success('✨ Event created successfully!')
        setOpen(false)
        setMessages([
          {
            role: 'assistant',
            content: "Hi! I'm your AI sports event assistant. I can ONLY help you create sports events. Just tell me what you need! For example:\n\n• \"Create a basketball tournament next Saturday at 2 PM\"\n• \"I want a weekly soccer practice every Monday at 6 PM\"\n• \"Plan a tennis championship on March 15th\"\n\nWhat sports event would you like to create?",
            timestamp: new Date(),
          },
        ])
        setExtractedEvent(null)
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error('error' in result ? result.error : 'Failed to create event')
      }
    } catch (error) {
      toast.error('Failed to create event')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2"
        variant="default"
      >
        <Sparkles className="h-4 w-4" />
        Create with AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl h-[85vh] sm:h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Event Creator
            </DialogTitle>
            <DialogDescription>
              Chat with AI to create your event. Just describe what you want!
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {extractedEvent && (
            <div className="border-t pt-4 space-y-2">
              <div className="text-sm font-medium">Extracted Event Details:</div>
              <div className="text-xs space-y-1 text-muted-foreground">
                {extractedEvent.name && <div>Name: {extractedEvent.name}</div>}
                {extractedEvent.sport && <div>Sport: {extractedEvent.sport}</div>}
                {extractedEvent.dateTime && (
                  <div>Date: {new Date(extractedEvent.dateTime).toLocaleString()}</div>
                )}
                {extractedEvent.location && <div>Location: {extractedEvent.location}</div>}
                {extractedEvent.venueNames && extractedEvent.venueNames.length > 0 && (
                  <div>Venues: {extractedEvent.venueNames.join(', ')}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateEvent}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setExtractedEvent(null)}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 border-t pt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your event..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

