import localFont from 'next/font/local'
import { Katibeh } from 'next/font/google'

export const katibeh = Katibeh({
  weight: '400',
  subsets: ['latin'],
})
export const numericFont = localFont({
  src: '../public/fonts/FarsiAdad.woff2',
  variable: '--font-adad',
})
export const numericBoldFont = localFont({
  src: '../public/fonts/FarsiAdad-Bold.woff2',
  variable: '--font-adad-bold',
})
export const numericRegularFont = localFont({
  src: '../public/fonts/FarsiAdad-Regular.woff2',
  variable: '--font-adad-reg',
})

export const primaryFont = localFont({
  src: '../public/fonts/FarsiFont.woff2',
  variable: '--font-sans',
})
export const SnapWebReg = localFont({
  src: '../public/fonts/SnappWeb2.0-Regular.woff',
  variable: '--font-snappReg',
})
export const SnapWebBold = localFont({
  src: '../public/fonts/SnappWeb2.0-Bold.woff',
  variable: '--font-snappReg',
})
export const SnapWebLight = localFont({
  src: '../public/fonts/SnappWeb2.0-Light.woff',
  variable: '--font-snappReg',
})
export const Anjoman = localFont({
  src: '../public/fonts/AnjomanVariableGX.ttf',
  variable: '--font-anjoman',
})
export const Potk = localFont({
  src: '../public/fonts/Potk.woff2',
  variable: '--font-snappReg',
})
export const GolpaBold = localFont({
  src: '../public/fonts/SD-Golpayegani Bold.woff2',
  variable: '--font-anjoman',
})
export const Golpa = localFont({
  src: '../public/fonts//SD-Golpayegani Grunge.woff2',
  variable: '--font-anjoman',
})
export const Shabnam = localFont({
  src: '../public/fonts/Shabnam.woff2',
  variable: '--font-sans',
})
export const ShabnamBold = localFont({
  src: '../public/fonts/Shabnam-Bold.woff2',
  variable: '--font-snappReg',
})
export const ShabnamThin = localFont({
  src: '../public/fonts/Shabnam-Thin.woff2',
  variable: '--font-anjoman',
})
export const ShabnamLight = localFont({
  src: '../public/fonts/Shabnam-Light.woff2',
  variable: '--font-snappReg',
})
export const ShabnamMedium = localFont({
  src: '../public/fonts/Shabnam-Medium.woff2',
  variable: '--font-anjoman',
})
export const GramophoneClean = localFont({
  src: '../public/fonts/Gramophone-Clean.woff2',
  variable: '--font-anjoman',
})
export const GramophoneStone = localFont({
  src: '../public/fonts/Gramophone-Stone.woff2',
  variable: '--font-snappReg',
})
export const GramophoneGrunge = localFont({
  src: '../public/fonts/Gramophone-Grunge.woff2',
  variable: '--font-anjoman',
})
export const Kaghaz = localFont({
  src: '../public/fonts/KaghazAlef-Bold.woff',
  variable: '--font-anjoman',
})
