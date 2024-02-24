# Catch error

when we're returning back an error to the client, we should handle catch error appropriately by _if (err instanceof Error)_

```typescript
export async function createSnippet(
    // formState always will be received as a first argument
  formState: { message: string },
  formData: FormData
) {
  try {
 //.. 
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    } else {
      return {
        message: 'Something went wrong...',
      };
    }
  }
 
```

