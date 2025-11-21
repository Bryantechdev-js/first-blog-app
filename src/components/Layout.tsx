import React, { ReactNode } from 'react'

function CustomLayout({children}: {children: ReactNode}) {
  return (
    <div>
      {children}
    </div>
  )
}

export default CustomLayout
