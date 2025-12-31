'use client'

import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/actions/auth'
import { LogOut } from 'lucide-react'
import { useTransition } from 'react'

export function TopNav() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Fastbreak
          </h1>
          <span className="text-sm text-muted-foreground">Events</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isPending}
          className="border-border hover:bg-accent"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </nav>
  )
}

