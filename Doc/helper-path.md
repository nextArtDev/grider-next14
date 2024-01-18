# We create it one time for revalidating

Recommended initial design:
1- Identify all the different routes you want your app to have + the idea that each shows
2- Make _path helper_ function
  
```typescript
// src/paths.ts

const paths = {
  home() {
    return '/';
  },
  topicShow(topicSlug: string) {
    return `/topics/${topicSlug}`;
  },
  postCreate(topicSlug: string) {
    return `/topics/${topicSlug}/posts/new`;
  },
  postShow(topicSlug: string, postId: string) {
    return `/topics/${topicSlug}/posts/${postId}`;
  },
};

export default paths;

```

3- Create your routing folders + page.tsx files based on step 1
    -  app/topics/[slug]/page.tsx
    -  app/topics/[slug]/posts/new/page.tsx
    -  app/topics/[slug]/posts/[postId]/page.tsx

4- Identify the places where data changes in your app
5- Make empty server actions for each those
    - create-post.ts
    - create-topic.ts
    - create-comment.ts
6- Add in comments on what paths you'll need to revalidate for each server action.
 first we should decide __When we call each server action which routes do we need to revalidate?__
    - createTopic --> Home page
    - createPost --> Topic Show (But time-base revalidation for home page too)
    - createComment --> Show a post (we need number of comments in home page, but in view a post page we have to revalidate it)

```typescript
// actions/create-topic.ts
export async function createTopic(){
    // TODO: revalidate the homepage after creating a topic post
}

```