import { FC } from 'react'

interface AboutBookProps {
  description?: string
}

const AboutBook: FC<AboutBookProps> = ({ description }) => {
  return (
    <div className="py-8 px-4 max-w-2xl mx-auto flex flex-col items-start">
      <h2 className="text-lg font-semibold py-4 ">درباره‌ی کتاب:</h2>
      <p className="text-justify px-4">{description}</p>
    </div>
  )
}

export default AboutBook
