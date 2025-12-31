'use client'

import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/actions/auth'
import { LogOut } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function TopNav() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOutAction()
      if (result.ok) {
        router.push('/login')
        router.refresh()
      }
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur supports-[backdrop-filter]:bg-cyan-500/5">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-cyan-400">
            Fastbreak
          </h1>
          <span className="text-xl font-bold tracking-tight text-cyan-300">Events</span>
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

