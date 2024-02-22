import type { Metadata } from 'next'

// import '../styles/prism1.css'

import React from 'react'

import { Toaster } from '@/components/ui/toaster'

import localFont from 'next/font/local'

// const numericFont = localFont({
//   src: '../public/fonts/FarsiAdad.woff2',
//   variable: '--font-adad',
// })
// const numericBoldFont = localFont({
//   src: '../public/fonts/FarsiAdad-Bold.woff2',
//   variable: '--font-adad-bold',
// })
// const numericRegularFont = localFont({
//   src: '../public/fonts/FarsiAdad-Regular.woff2',
//   variable: '--font-adad-reg',
// })

// const primaryFont = localFont({
//   src: '../public/fonts/FarsiFont.woff2',
//   variable: '--font-sans',
// })
// const SnapWebReg = localFont({
//   src: '../public/fonts/SnappWeb2.0-Regular.woff',
//   variable: '--font-snappReg',
// })
// const Anjoman = localFont({
//   src: '../public/fonts/AnjomanVariableGX.ttf',
//   variable: '--font-anjoman',
// })

export const metadata: Metadata = {
  title: 'DevFlow',
  description:
    'A community-driven platform for asking and answering programming questions',
  // Changing the fav-icon
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <body
    //   className={`${primaryFont.variable} ${Anjoman.variable} ${SnapWebReg.variable} font-snappReg adad  antialiased  `}
    // >
    <div className="">{children}</div>
    // </body>
  )
}
