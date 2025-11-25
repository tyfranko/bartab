export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="logo-text text-4xl">
            <span className="logo-bar">Bar</span>
            <span className="logo-tab">Tab</span>
            <span className="logo-tm">™</span>
          </h1>
        </div>
        {children}
      </div>
    </div>
  )
}

