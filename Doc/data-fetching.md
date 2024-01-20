# Data fetching

1- Separate file that lists all the queries that can provide data to 'PostList'

```typescript
type PostWithData = (Post & {
    topic:{ slug:string },
    _count:{ comments:number },
    user:{ name: string}
})

export function fetchPostsBySlug(slug: sting): Promise <PostWithData[]>{
    
}

export function fetchTopPosts(): Promise <PostWithData[]>{

}
```

2- PostList expects to receive a function that will return "PostWithData[]"

```typescript
interface PostListProps {
    fetchPosts:() => Promise <PostWithData[]>
}
```

3- Parent components can decide _what data to fetch, children fetch it_ 

```typescript
// TopicShowPage
import {fetchPostsBySlug} from 'queries/posts'
import PostList from './post-list'

export default function TopicShowPage({params:{slug}}) {
    return <PostList
        fetchData={()=> fetchPostsBySlug(slug)}
    />
}
```

```typescript
// HomePage
import {fetchTopPosts} from 'queries/posts'
import PostList from './post-list'

export default function HomePage() {
    return <PostList
        fetchData={fetchTopPosts}
    />
}
```

in result:

```typescript
export default function async PostList({fetchData}) {
    const posts = await fetchData()

    return posts.map(()=> ... )
}
```

## Example of steps above

1- Create query file

_db/queries/posts.ts_

```typescript
export type PostWithData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

// Its important to specify the return type, here: Promise<PostWithData[]>
export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}
```

2- 
_src/components/PostLists.ts_

```typescript
import type { PostWithData } from '@/db/queries/posts';
import Link from 'next/link';
import paths from '@/paths';

interface PostListProps {
  fetchData: () => Promise<PostWithData[]>;
}

export default async function PostList({ fetchData }: PostListProps) {
  const posts = await fetchData();

  const renderedPosts = posts.map((post) => {
    const topicSlug = post.topic.slug;

    if (!topicSlug) {
      throw new Error('Need a slug to link to a post');
    }

    return (
      <div key={post.id} className="border rounded p-2">
        <Link href={paths.postShow(topicSlug, post.id)}>
          <h3 className="text-lg font-bold">{post.title}</h3>
          <div className="flex flex-row gap-8">
            <p className="text-xs text-gray-400">By {post.user.name}</p>
            <p className="text-xs text-gray-400">
              {post._count.comments} comments
            </p>
          </div>
        </Link>
      </div>
    );
  });

  return <div className="space-y-2">{renderedPosts}</div>;
}

```

3- find parent component to show TopicLists

_app/topics/[slug]/page.tsx_

```typescript
import PostCreateForm from '@/components/posts/post-create-form';
import PostList from '@/components/posts/post-list';
import { fetchPostsByTopicSlug } from '@/db/queries/posts';

interface TopicShowPageProps {
  params: {
    slug: string;
  };
}

export default function TopicShowPage({ params }: TopicShowPageProps) {
  const { slug } = params;

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-2">{slug}</h1>
        <PostList fetchData={() => fetchPostsByTopicSlug(slug)} />
      </div>

      <div>
        <PostCreateForm slug={slug} />
      </div>
    </div>
  );
}
```

## Deduplicating Requests with __cache__ function

We just wrap all the query function with _cache_ which is from _react_
_cache((postId: string): Promise<CommentWithAuthor[]> => )_

```typescript
import type { Comment } from '@prisma/client';
import { cache } from 'react';
import { db } from '@/db';

export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

export const fetchCommentsByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    return db.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);

```

