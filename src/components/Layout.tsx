import React, { ReactNode } from 'react'
import Navbar from './Navbar'

function CustomLayout({children}: {children: ReactNode}) {
  return (
    <div>
       <Navbar/>
      {children}
    </div>
  )
}

export default CustomLayout
