const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-200 to-blue-400"
    >
      {children}
    </div>
  )
}

export default AuthLayout
