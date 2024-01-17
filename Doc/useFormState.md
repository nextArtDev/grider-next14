# useFormState

We need to somehow __communicate info from a server action back to a page__ and useFormState does that _without JS in the browser_ . By using that we can send back success or error message from server to component.

## How we can do that by startTransition

```typescript
const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
        if (data.success) {
          router.push(`/otp/${values.phone}`)
        }
      })
    })
  }


// server side

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }
```

## using useFormState

```typescript
const [updatedStet, action:updatedServerAction ]=useFormSate(serverAction,{`initial state object`})

<form action={action}>
//..
<p>{formState.message}</p>

```

- In _useFormState_ the _first argument_ is the _server action_
- The second object is _some initial state object_
When we use useFormState We get back two elements:
- first our _formState_ the object that changed and sent back to us
- second is the _updated version of our server action_ we get it and pass it instead of original server action.

```typescript
import { useFormState } from 'react-dom';
import * as actions from '@/actions';

export default function SnippetCreatePage() {
  const [formState, action] = useFormState(actions.createSnippet, {
    message: '',
  });

  return (
    <form action={action}>
      <h3 className="font-bold m-3">Create a Snippet</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="w-12" htmlFor="title">
            Title
          </label>
          <input
            name="title"
            className="border rounded p-2 w-full"
            id="title"
          />
        </div>
        {formState.message ? (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {formState.message}
          </div>
        ) : null}

        <button type="submit" className="rounded p-2 bg-blue-200">
          Create
        </button>
      </div>
    </form>
  );
}


// server

export async function createSnippet(
    // formState always will be received as a first argument
  formState: { message: string },
  formData: FormData
) {
  try {
    // Check the user's inputs and make sure they're valid
    const title = formData.get('title');
    const code = formData.get('code');

    if (typeof title !== 'string' || title.length < 3) {
      return {
        message: 'Title must be longer',
      };
    }
    if (typeof code !== 'string' || code.length < 10) {
      return {
        message: 'Code must be longer',
      };
    }

    // Create a new record in the database
    await db.snippet.create({
      data: {
        title,
        code,
      },
    });
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
}
```
