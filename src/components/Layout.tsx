import React, { ReactNode } from 'react'
import Navbar from './Navbar'
import { Toaster } from 'sonner'

function CustomLayout({children}: {children: ReactNode}) {
  return (
    <div>
       <Navbar/>
      {children}
      <Toaster/>
    </div>
  )
}

export default CustomLayout
