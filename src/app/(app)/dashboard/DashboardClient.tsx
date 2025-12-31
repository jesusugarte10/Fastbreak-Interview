'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'

type DashboardClientProps = {
  initialSearch?: string
  initialSport?: string
  initialDateFilter?: string
  sports: string[]
}

const DATE_FILTERS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past Events' },
]

export function DashboardClient({ 
  initialSearch, 
  initialSport, 
  initialDateFilter,
  sports 
}: DashboardClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(initialSearch || '')

  // Execute search - called on button click or Enter key
  const executeSearch = () => {
    const params = new URLSearchParams(window.location.search)
    const trimmedSearch = searchValue.trim()
    
    if (trimmedSearch) {
      params.set('search', trimmedSearch)
    } else {
      params.delete('search')
    }
    
    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  // Handle Enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch()
    }
  }

  const handleFilterChange = (key: string, value: string, defaultValue: string) => {
    const params = new URLSearchParams(window.location.search)
    
    // Include current search value
    const trimmedSearch = searchValue.trim()
    if (trimmedSearch) {
      params.set('search', trimmedSearch)
    } else {
      params.delete('search')
    }
    
    // Apply the filter change
    if (value && value !== defaultValue) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-3 flex-col sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search with Button */}
      <div className="flex flex-1 min-w-[200px] gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search events..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
            disabled={isPending}
          />
        </div>
        <Button 
          onClick={executeSearch} 
          disabled={isPending}
          variant="secondary"
          size="default"
        >
          Search
        </Button>
      </div>

      {/* Sport Filter */}
      <Select 
        defaultValue={initialSport || 'all'} 
        onValueChange={(v) => handleFilterChange('sport', v, 'all')} 
        disabled={isPending}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          {sports.map((sport) => (
            <SelectItem key={sport} value={sport}>
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Filter */}
      <Select 
        defaultValue={initialDateFilter || 'all'} 
        onValueChange={(v) => handleFilterChange('date', v, 'all')} 
        disabled={isPending}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          {DATE_FILTERS.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
