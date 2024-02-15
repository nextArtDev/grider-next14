'use client'
import { LampContainer } from '@/components/shared/LampEffect'
import { FC } from 'react'
import { motion } from 'framer-motion'

interface LampHeaderProps {
  name: string
}

const LampHeader: FC<LampHeaderProps> = ({ name }) => {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="mt-4 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-5xl"
      >
        {name}
      </motion.h1>
    </LampContainer>
  )
}

export default LampHeader
