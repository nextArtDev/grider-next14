# Caching

## Data Cache

Responses from requests made with _fetch_ are stored and used across requests.

## Request Memoization

Make two or more requests with _fetch_ during a user's request to your server? Only one is actually expected.

## Route Cache

'Soft' navigation between routes are cached in the browser and reused when a user visits a page.

## Full Route Cache

At build time, Next decides if your route is _static_ or _dynamic_. if it is static, the page is rendered and that result is stored. in production, users are given this pre-rendered result.

### revalidatePath

allows you to purge cached data on-demand for a specific path.
_revalidatePath(path: string, type?: 'page' | 'layout'): void;_

### revalidateTag

 allows you to purge cached data on-demand for a specific cache tag.

## Static routes ◯

<!-- <span style="color:red;">  </span> -->
Next will render the page _Now, One Time_ and give that version to everyone who visits your app.  

## dynamic routes λ

Next will render the page _whenever someone visits it_

## What makes a page 'dynamic'?

- Calling a _dynamic function_ or referencing a _dynamic variable_ when your route renders:
  _useSearchParams()_ , _searchParams prop_ , _cookies.set()_ , _cookies.delete()_
- Assigning specific _route segment config_ options:
  _export const dynamic='force-dynamic'_ , _export const revalidate=0_ , _noStore()_

- Calling _fetch_ and opting out caching of the response.
  _fetch(...,{next:{revalidate:0}})_

- Using a _dynamic route_
  _/snippet/[id]/_ 

## Ways to control caching

### Time-Based 

Every X seconds, ignore the cache response and fetch new data.

- front page of the social media site
- Data is changing all the time - only get the top posts every 10-30 seconds

```typescript
export const revalidate = 3
```

### On-Demand 

Forcibly purge a cached response 

- Any app where we know _when_ data changes _and_ the user expects tp see up-to-date data.

```typescript
export const dynamic = 'force-dynamic'
```

```typescript
 revalidate('/snippet')
```

## generateStaticParams

The generateStaticParams function can be used in __combination with dynamic route segments to statically generate routes at build time__ instead of on-demand at request time.

//

```typescript

const snippet = await db.snippet.findFirst({
    where: { id: parseInt(props.params.id) },
  });

  if (!snippet) {
    return notFound();
  }

return {

    //..
 }

export async function generateStaticParams() {
  const snippets = await db.snippet.findMany();

  return snippets.map((snippet) => {
    return {
      id: snippet.id.toString(),
    };
  });
}
```

## Important note about caching auth()

When we define a header and that header fetches server side _await auth()_, in this situation next-auth modifies cookies and make the page dynamic.

### static caching using auth()

we create a client-side header and authenticate user by __useSession()__ and we handle delay by _session.status==='loading'_

```typescript
const session = useSession()

let authContent: React.ReactNode;
if(session.status ==='loading'){
  authContent=null
} else if (session.data?.user) {
  //...
}
```