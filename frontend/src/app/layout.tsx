import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Habitat for Humanity SLO',
    description: 'Web site created using nextjs',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <head>
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#000000" />
        </head>
        <body>
            <div id="root">{children}</div>
        </body>
    </html>
    )
}