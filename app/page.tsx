import Image from 'next/image'
import ChatComponent from '../app/components/ChatComponent'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ChatComponent />
      <div className="z-10 max-w-5xl margin-top-500 w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
    </main>
  )
}
