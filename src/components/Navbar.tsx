"use client"


import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
 import { Menu } from 'lucide-react';

function Navbar() {
    const [toggle,setToggle] = useState<boolean>(true)

    // const checkToggler =(toggled:boolean)=>{
    //     setToggle(toggled)
    //     console.log(toggle);
        
    // }
    const [query,setQuery] = useState<any>()
    const pageClick=()=>{
        let router = useParams().id
        let routers = JSON.stringify(router).split("?")[0]
        setQuery(routers)
        console.log(routers);
        

    }
  return (
    <nav className='w-full h-25 shadow flex  justify-between items-center px-5 py-5 relative -z-50'>
        <div className="nav-brand">Logo</div>
        <ul className={`nav-menu w-full h-auto sm:justify-center   ${toggle ? "hidden" : "block"} flex-col sm:flex-row    gap-3 sm:gap-10 absolute -bottom-full px-5 sm:inline-flex  left-0 sm:top-[37%] bg-gray-200 py-5 sm:py-0`}>
            <Link href="/">
            <li className={`nav-item hover:text-green-200 cursor-pointer ${query == "/" ? "text-red-400" : "text-black"}`} onClick={()=> pageClick()}>Home</li>
            </Link>
            <Link href="/about">
            <li className="nav-item hover:text-green-200 cursor-pointer" onClick={()=> pageClick()}>About</li>
            </Link>
            <Link href="/Contact">

            <li className="nav-item hover:text-green-200 cursor-pointer" onClick={()=> pageClick()}>Contact</li>
            </Link>
           
        </ul>
        <div className="toggle-menu cursor-pointer inline-block sm:hidden" onClick={()=>setToggle(!toggle)}>
            <Menu size={40}/>
        </div>
    </nav>
  )
}

export default Navbar
