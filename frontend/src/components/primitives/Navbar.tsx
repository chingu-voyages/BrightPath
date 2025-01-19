import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const user = {}
  return (
    <nav className='flex justify-between items-center p-6 md:px-12  rounded-xl shadow-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'>
      <Link href={"/"} className=''>
        Logo
      </Link>

      {/* links */}

      <ul className='flex gap-6 justify-center font-semibold text-lg md:text-xl'>
        <Link href={"/"} className='hidden sm:block'>Home</Link>
        <Link href={"/courses"} className='hidden sm:block'>Courses</Link>
        <Link href={user ? `/settings/${user}`:'/login'}>
          O
        </Link>
      </ul>
    </nav>
  )
}

export default Navbar
