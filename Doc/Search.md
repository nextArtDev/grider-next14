# Search

Page components receive the query string data through the 'searchParams' prop

```typescript
interface SearchPageProps{
    searchParams:{
        term:string
    }
}

function SearchPage ({searchParams}: SearchPageProps){
    return <div>
    {searchParams.term}
    </div>
}
```

Client components can get query string data with __'useSearchParams'__

```typescript
'use client'
import {useSearchParams} from 'next/navigation'

function SearchInput(){

    const searchParams = useSearchParams()

    return <div>
    {searchParams.term}
    </div>
}
```

## Using useSearchParams

- client components with _'useSearchParams'_ need to be wrapped with 'Suspense' or __you'll get a strange warning at build time__.
- PAges that reference 'searchParams' will be marked as _dynamic_ for purposes of build time caching

```typescript
'use client'
import {useSearchParams} from 'next/navigation'

function SearchInput(){

    const searchParams = useSearchParams()

    return <div>
    {searchParams.term}
    </div>
}

function Page(){
    return <div>
    <Suspense>
        <SearchInput />
    <Suspense>
</div>
}
```

## Full Example of Search

1- accessing the Query String to put it in input 
2- we should make sure we redirect user to _/search?term=javascript_ route

```typescript
import { useSearchParams } from 'next/navigation';
import * as actions from '@/actions';

export default function SearchInput() {
    const searchParams = useSearchParams();

  return (
      <form action={actions.search}>
      <Input name="term" defaultValue={searchParams.get('term') || ''} />
    </form>
  );
}
```

3- we use server action to make search _even user disabled javascript_

```typescript
'use server';

import { redirect } from 'next/navigation';

export async function search(formData: FormData) {
  const term = formData.get('term');

  if (typeof term !== 'string' || !term) {
    redirect('/');
  }

  redirect(`/search?term=${term}`);
}
```

3- receiving the query string in a server component

```typescript
// app/search/page.tsx

interface SearchPageProps {
  searchParams: {
    term: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = searchParams;

  if (!term) {
    redirect('/');
  }

  return (
    <div>
      <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
    </div>
  );
}
```
4- Running The search by queries

```typescript
// db/queries/posts.ts
export function fetchPostsBySearchTerm(term: string): Promise<PostWithData[]> {
  return db.post.findMany({
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    where: {
      OR: [{ title: { contains: term } }, { content: { contains: term } }],
    },
  });
}

```

5- __IMPORTANT__ wrap search component with Suspense

```typescript
// src/component/header.tsx

<NavbarItem>
    <Suspense>
      <SearchInput />
    </Suspense>
</NavbarItem>
```