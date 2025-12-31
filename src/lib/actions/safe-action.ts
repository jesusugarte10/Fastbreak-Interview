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
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

