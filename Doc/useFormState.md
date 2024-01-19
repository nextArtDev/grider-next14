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

## validation 

All the "___TYPE___"s should be the same.

```typescript
// component
import {useFormState} from 'react-dom'

function Component() {
  const [formState, action] = useFormState(serverAction, ___TYPE___)
  
  return <form action = {action}>
  </form>
}

//Action

'use server'

async function ServerAction(formState: ___TYPE___, formData:FormData)

return ___TYPE___
```

## Error in serverAction by .flatten()

we use _result.error.flatten().fieldError_ to flatMap errors

```typescript
const result = createTopicsSchema.safeParse({
  name:formData.get('name')
  description: formData.get('description')
})

if(!result.success){
  console.log(result.error.flatten().fieldErrors)
}

  {
    success:false,
    error:{
      issues:[
        /** object about a failed validation rule */
            /** object about a failed validation rule */
            /** object about a failed validation rule */
        ]
    }
}

// The result: result.error.flatten().fieldErrors
{
  name:[
    "String must contain at least 3 characters'
   ],
  description:[
    "String must contain at least 3 characters'
   ]
}
```

## Example of useFormSate

```typescript

export default function TopicCreateForm() {
  const [formState, action] = useFormState(actions.createTopic, {
    errors: {},
  });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create a Topic</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              isInvalid={!!formState.errors.name}
              errorMessage={formState.errors.name?.join(', ')}
            />

            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.join(', ')}
            />

            {formState.errors._form ? (
              <div className="rounded p-2 bg-red-200 border border-red-400">
                {formState.errors._form?.join(', ')}
              </div>
            ) : null}

            <FormButton>Save</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}



'use server';

import type { Topic } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import paths from '@/paths';

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: 'Must be lowercase letters or dashes without spaces',
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    // form level errors like: auth error, db failed or ...
    // we add _ to avoid accidentally convolution with other form names 
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }

  revalidatePath('/');
  redirect(paths.topicShow(topic.slug));
}

```

## How we send additional information with useFormState

we add this _.bind_ method to our useFormState action and _accept that as a first argument in server action_

```typescript
const [formState, action]= useFormState(actions.createPost.bind(null, slub),{
  errors:{}
})

'use server'

export async function createPost(
  slug:string,
  formState:CreatePostFormState,
  formData:FormData
):Promise<CreatePostFormState>{
  return ...
}

```