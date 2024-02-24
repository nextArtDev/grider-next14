'use client'
// import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.actions'
// import { viewQuestion } from '@/lib/actions/interaction.action'
// import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action'
// import { toggleSaveQuestion } from '@/lib/actions/user.action'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

import { toggleSaveQuestion } from '@/lib/actions/social/user.action'
import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/lib/actions/social/question.action'
import {
  downvoteAnswer,
  upvoteAnswer,
} from '@/lib/actions/social/answer.actions'
import { toast } from 'sonner'
import { viewQuestion } from '@/lib/actions/social/interaction.action'

interface VotesProps {
  type: string
  itemId: string
  userId: string
  upvotes: number
  hasupVoted: boolean
  downvotes: number
  hasdownVoted: boolean
  hasSaved?: boolean
}

const Votes: FC<VotesProps> = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId,
      questionId: itemId,
      path: pathname,
    })
    if (!hasSaved) {
      return toast.success('سوال در کالکشن شما ذخیره شد.')
    } else if (hasSaved) {
      return toast.error('سوال از کالشن شما حذف شد')
    }
  }
  const handleVote = async (action: string) => {
    if (!userId) return toast.error('لطفا وارد حساب خود شوید.')
    if (action === 'upvote') {
      if (type === 'Question') {
        await upvoteQuestion({
          questionId: itemId,
          userId: userId,
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      } else if (type === 'Answer') {
        await upvoteAnswer({
          answerId: itemId,
          userId: userId,
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      }

      // todo: show a toast
      if (!hasupVoted) {
        return toast.success('رای مثبت شما اعمال شد.')
      } else if (hasupVoted) {
        return toast.error('رای مثبت شما حذف شد.')
      }
    }
    if (action === 'downvote') {
      if (type === 'Question') {
        await downvoteQuestion({
          questionId: itemId,
          userId,
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      } else if (type === 'Answer') {
        await downvoteAnswer({
          answerId: itemId,
          userId,
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      }

      // todo: show a toast
      if (!hasdownVoted) {
        return toast.success('رای منفی شما اعمال شد.')
      } else if (hasdownVoted) {
        return toast.error('رای منفی شما حذف شد.')
      }
    }
  }

  // Views: When some one viewed, whenever Vote component loads
  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId: userId || undefined,
    })
  }, [itemId, userId, pathname, router])

  return (
    <div className="flex gap-5">
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-0.5">
          <div className="flex min-w-[18px] items-center justify-center rounded-sm p-1 ">
            <p className="font-semibold">{upvotes}</p>
          </div>
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
        </div>
        <div className="flex items-center justify-center gap-0.5">
          <div className="flex min-w-[18px] items-center justify-center rounded-sm p-1 ">
            <p className="font-semibold">{downvotes}</p>
          </div>
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  )
}

export default Votes
