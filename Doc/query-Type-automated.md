# How to automate Post With Extras type

Instead of creating type of query by this:

```typescript
type PostWithData = (Post & {
    topic:{ slug:string },
    _count:{ comments:number },
    user:{ name: string}
})
```

we can kind of infer that:

```typescript
type PostWithData = Awaited<ReturnType<typeof fetchPostsByTopicsSlug>>[number]
```

