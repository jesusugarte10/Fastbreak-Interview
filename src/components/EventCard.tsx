'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteEventDialog } from './DeleteEventDialog'

type Venue = {
  id: string
  name: string
}

type EventCardProps = {
  id: string
  name: string
  sport: string
  startsAt: string
  description?: string | null
  location?: string | null
  venues: Venue[]
}

export function EventCard({ id, name, sport, startsAt, description, location, venues }: EventCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(startsAt), 'PPP p')}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {sport}
          </Badge>
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
      )}
      <CardContent className="space-y-3">
        {location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {venues.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {venues.map((venue) => (
                <Badge key={venue.id} variant="outline" className="text-xs">
                  {venue.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No venues</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/events/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <DeleteEventDialog eventId={id} eventName={name}>
          <Button variant="destructive" size="sm" className="flex-1">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DeleteEventDialog>
      </CardFooter>
    </Card>
  )
}

