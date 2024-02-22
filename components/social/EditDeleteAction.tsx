'use client'
// import { deleteAnswer } from '@/lib/actions/answer.actions'
// import { deleteQuestion } from '@/lib/actions/question.action'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'

interface EditDeleteActionProps {
  type: string
  itemId: string
}

const EditDeleteAction: FC<EditDeleteActionProps> = ({ type, itemId }) => {
  const pathname = usePathname()
  const router = useRouter()
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`)
  }
  const handleDelete = async () => {
    if (type === 'Question') {
      // Delete question
      // await deleteQuestion({ questionId: itemId, path: pathname })
    } else if (type === 'Answer') {
      // Delete answer
      // await deleteAnswer({
      //   answerId: itemId,
      //   path: pathname,
      // })
    }
  }
  return (
    <div className="flex items-center justify-end gap-3 text-slate-200 max-sm:w-full">
      {type === 'Question' && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  )
}
export default EditDeleteAction
