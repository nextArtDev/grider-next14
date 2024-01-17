# All form actions 

## server action forms

### calling server action from server component

- pass values to function by action: _<form action={createSnippet} >_
- get values as an argument by _(formData:FormData)_
- get each value by suing _formData.get()_ method

```typescript
export async function createSnippet(formData:FormData){+
    'use server'
    const title = formData.get('title')
    const code = formData.get('code')
    //...
    redirect('/') // from next/navigation
}
return(
    <form action={createSnippet} >
    //..
    </form>
)
```

### calling server action in client component 

#### method that used in instagram-clone

Its next js specific and it will pass all the form fields.
we can access to formData content by using _formData.get('formFieldName')_
formData Type is _FormData_

```typescript

<form
    action={async (formData) => {
      await deletePost(formData)
    }}   
  >
     <input type="hidden" name="id" value={post.id} />
  </form>


  //server side
  export async function deletePost(formData: FormData) {

  const { id } = DeletePost.parse({
    id: formData.get('id'),
  })

```

#### including some state in server action

we have two options

- using _.bind(null, code)_ : form will work even _if the user isn't running javascript in their browser_
- useTransition hook: from classic react (and we don't need  bind method)


##### .bind function

If we add a bind method on a function, any argument that we pass a second option, preloads the function.
now the arguments of server actions will change and the first argument would be the second argument which we pass by using the bind method 

```typescript
// client
import * as actions from 'actions'
function ClientComponent(){
    const [code, setCode] = useState('')
// editSnippetAction() would get a code, as a first argument
const editSnippetAction = action.editSnippet.bind(null, code)

return <form action={editSnippetAction} >
</form>
// server

'use server'

// the first argument that function receives is the second arg of passed function
export async function editSnippet(code:string, formData:FormData){
    //...
}
```

##### useTransition

Its for using when in server action, user wants to do sth besides submitting the form.
Why we use startTransition: _Inside of our server action when we run it we change data and redirect it somewhere around of app, the goal of startTransition is to sync up the change of data to our db with that navigation_ it become ensure that we don't navigate before data updates.
Point: It can be easily done by shadcn forms.

```typescript
// client
import * as actions from 'actions'
function ClientComponent(){
    const [code, setCode] = useState('')

const handleClick = ()=>{
    startTransition(async ()=>{
        await actions.editSnippet(code)
    })
}

return <button onClick={handleClick} >
</button>
// server

'use server'
 
export async function editSnippet(code:string){
    //...
}
```

DOC: useTransition is a React Hook that lets you update the state without blocking the UI.

- The isPending flag that tells you whether there is a pending transition.
- The startTransition function that lets you mark a state update as a transition.

If some state update causes a component to suspend, that state update should be wrapped in a transition.

@param callback — A synchronous function which causes state updates that can be deferred.

Here we use useTransition to use isPEnding for disabling too.

```typescript
const [isPending, startTransition] = useTransition()

 <form
  onSubmit={form.handleSubmit(async (values) => {
    // copy to immediately reset the form
    const valuesCopy = { ...values }
    form.reset()

    // Without startTransition we get an error 
    startTransition(() => {
      addOptimisticComment(valuesCopy.body)
    })
    await createComment(valuesCopy)
  })}
  >
```

## Example of using bind method to update

```typescript
'use client'
export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);

  const handleEditorChange = (value: string = '') => {
    setCode(value);
  };

// passing two arguments to server action
  const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);

  return (
    <div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language="javascript"
        defaultValue={snippet.code}
        options={{ minimap: { enabled: false } }}
        onChange={handleEditorChange}
      />
      <form action={editSnippetAction}>
        <button type="submit" className="p-2 border rounded">
          Save
        </button>
      </form>
    </div>
  );
}

'use server'
// our second and third arguments from form action, here are first and second arguments
export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });

// first we revalidate path then we redirect by using next/navigation
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

```