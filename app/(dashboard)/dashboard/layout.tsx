import { ModalProvider } from '@/providers/modal-providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ModalProvider />
      {children}
    </div>
  )
}
