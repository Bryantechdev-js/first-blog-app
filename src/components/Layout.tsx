import React, { ReactNode } from 'react'
// import Navbar from './Navbar'
import { Toaster } from 'sonner'
import Header from './Header'

function CustomLayout({children}: {children: ReactNode}) {
  
  
  return (
    <div>
       <Header/>
      {children}
      <Toaster/>
    </div>
  )
}

export default CustomLayout
