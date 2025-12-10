"use client"

import React from 'react';
import { Input } from './ui/input';
import { Edit, LogOut, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { logoutUserAction } from '@/actions/logout';
import { toast } from 'sonner';

function Header() {
    const router = useRouter();

    const handleEdit =()=>{
        router.push("/create/blog");
    }

    const handleLogout = async()=>{
        try{
            const logoutresult = await logoutUserAction()
            if(!logoutresult?.success){
                toast("Logout Failed",{
                    description:"Logout failed please try again later"
                })
            }
            toast("Logout successful",{
                description:"You logout successfully. you can login"
            })
            router.push("/login")

        } catch(error){
            console.log(error);
        }
    }
  return (
   <header className='max-w-full h-24 flex justify-between items-center px-3 sm:px-5'>
    <div className="logo">
        <a href="/">
            <div className='flex gap-3 justify-center items-center'>
                <div className='text-2xl bg-gray-500 rounded-full w-10 h-10 flex justify-center items-center text-white'>M</div>
                <span>Medium</span>
            </div>
        </a>
    </div>
    <div className="wrapper flex space-x-3  sm:space-x-10">
        <div className='releative  hidden sm:block  bg-gray-200 p-1  rounded-full'>
            <Input placeholder='search...' className='rounded-full  focus-visible:ring'/>
            <Search className='absolute top-9 right-46 cursor-pointer transform -rotate-360' size={20}/>
        </div>
         <Button className='cursor-pointer' onClick={handleEdit}>
            <Edit className='cursor-pointer'/>
         </Button>

         {/* dropdown menu  */}

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className='h-8 w-8 cursor-pointer'>
                    <AvatarFallback>
                        <AvatarImage src={""}/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='h-4 w-4'/>
                    <span className=''>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
    </div>
   </header>
  );
}

export default Header;
