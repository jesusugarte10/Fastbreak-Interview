'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type VenueMultiInputProps = {
  value: string[]
  onChange: (venues: string[]) => void
  error?: string
}

export function VenueMultiInput({ value, onChange, error }: VenueMultiInputProps) {
  const [inputValue, setInputValue] = React.useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue('')
    }
  }

  const handleRemove = (venue: string) => {
    onChange(value.filter((v) => v !== venue))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter venue name and press Enter"
          className={error ? 'border-destructive' : ''}
        />
        <Button type="button" onClick={handleAdd} variant="outline">
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((venue) => (
            <Badge key={venue} variant="secondary" className="gap-1">
              {venue}
              <button
                type="button"
                onClick={() => handleRemove(venue)}
                className="ml-1 rounded-full hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

