import Link from 'next/link'
import { MdBlurOn } from 'react-icons/md'
import { RiImageAddFill } from 'react-icons/ri'

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="relative h-[70%] w-full overflow-hidden py-20">
        <h1 className="flex items-center justify-center gap-2 text-4xl font-bold">
          <MdBlurOn size={50} />
          Blur It
        </h1>
        <Link href={'/editor'}>
          <div className="group text-background absolute bottom-10 left-1/2 flex h-60 w-60 -translate-x-1/2 cursor-pointer flex-col items-center justify-center italic duration-300">
            <div className="bg-primary/90 absolute inset-0 z-0 rounded-full transition-transform duration-300 group-hover:scale-120" />
            <div className="z-10 flex flex-col items-center justify-center">
              <RiImageAddFill size={80} />
              <span>Add Image</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
