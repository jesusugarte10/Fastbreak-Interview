type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export async function safeAction<T>(
  action: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await action()
    return { ok: true, data }
  } catch (error) {
    // Handle Supabase errors
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as { message: string }).message
      
      // Check for common Supabase errors
      if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        return {
          ok: false,
          error: 'Database tables not found. Please run the SQL schema in Supabase.',
        }
      }
      
      if (errorMessage.includes('permission denied') || errorMessage.includes('RLS')) {
        return {
          ok: false,
          error: 'Permission denied. Please check your database RLS policies.',
        }
      }
      
      return {
        ok: false,
        error: errorMessage,
      }
    }
    
    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        ok: false,
        error: error.message,
      }
    }
    
    // Fallback for unknown error types
    return {
      ok: false,
      error: `An error occurred: ${String(error)}`,
    }
  }
}

