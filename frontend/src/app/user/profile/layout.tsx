
import { Metadata } from 'next';
import React from 'react'
export const metadata: Metadata = {
    title: "Profile",
    description: "General Student infos",
};

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
        {children}
    </>
  )
}

export default Layout
