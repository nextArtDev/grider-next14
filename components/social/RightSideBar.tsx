import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import Chevron from '../../public/assets/icons/arrow-left.svg'
import RenderTag from './RenderTag'
// import { getHotQuestions } from '@/lib/actions/question.action'
// import { getTopPopularTags } from '@/lib/actions/tag.actions'
import { ChevronLeft } from 'lucide-react'
interface RightSideBarProps {}

const hotQuestions = [
  {
    id: 1,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
  {
    id: 2,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
  {
    id: 3,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
  {
    id: 4,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
]

const PopularTags = [
  { id: '1', name: 'javascript', totalQuestios: 5 },
  { id: '2', name: 'nextjs', totalQuestios: 5 },
  { id: '3', name: 'nodejs', totalQuestios: 4 },
  { id: '4', name: 'threejs', totalQuestios: 2 },
  { id: '5', name: 'mongodb', totalQuestios: 5 },
]
const RightSideBar: FC<RightSideBarProps> = async () => {
  // const hotQuestions = await getHotQuestions()
  // const PopularTags = await getTopPopularTags()

  // console.log(PopularTags)

  return (
    <section className="font-farsiSnapReg sticky right-0 top-0 flex min-h-screen w-[350px] flex-col overflow-y-auto border-l border-gray-700 bg-transparent p-6 pt-24 shadow max-xl:hidden ">
      <div>
        <h3 className="text-xl font-semibold dark:text-gray-200">
          سوالات پربحث
        </h3>
      </div>
      <div className="mt-8 flex w-full flex-col gap-[30px] text-sm text-gray-400">
        {hotQuestions.map((question) => (
          <Link
            href={`/question/${question.id}`}
            key={question.id}
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <p>{question.title}</p>
            <ChevronLeft width={30} height={30} />
            {/* <Image src={Chevron} alt="chevron right" width={20} height={20} /> */}
          </Link>
        ))}
        <h3 className="mt-7 text-xl font-semibold dark:text-gray-200">
          هشتگ‌های پرطرفدار
        </h3>
        <div className="mt-3 flex flex-col gap-4">
          {PopularTags.map((tag) => (
            <RenderTag
              key={tag.id}
              id={tag.id.toString()}
              name={tag.name}
              // totalQuestions={tag.numberOfQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RightSideBar
