export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        /* Override public site cursor hiding for the entire admin portal */
        body {
          cursor: auto !important;
        }
      `}</style>
      {children}
    </>
  )
}
