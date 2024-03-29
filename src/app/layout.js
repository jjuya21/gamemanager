
import "C:/Users/gc_de/next/my-app/src/style/globals.css";
import Link from "next/link";



export const metadata = {
  title: '...',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="App-header">
          <span>...</span>
        </header>
        <div className="section-content">
          <div className="sidebar">
            <Link href='/'>로그인</Link>
          </div>
          <section className="main-content">
            {children} 
          </section>
        </div>
      </body>
    </html>
  )
}
