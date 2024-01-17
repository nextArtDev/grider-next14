# Pints

## notFound
we first creating not-found page, then return it.
when we create a _not-found_ page, every page uses the most closest not-found page to itself.

```typescript
if(!snippet){
    return notFound()
}
```

## pausing 

```typescript
await new Promise((r)=>setTimeout(r,2000));

```