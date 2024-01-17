# redirect

redirect always should be outside of try/catch, because the catch would capture it and we do not redirect to route.


```typescript
export async function createSnippet( 
formState: { message: string },
  formData: FormData
) {
  try {

 //...

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

  revalidatePath('/');
  
  // Redirect the user back to the root route
  redirect('/');
```