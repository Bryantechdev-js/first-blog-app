import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import React from 'react'

function LoginPage() {
  return (
     <div className='min-h-screen w-full flex flex-col md:flex-row bg-linear-to-br from-gray-100 to-gray-200'>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Register</h1>
          <p>create your account and get started</p>
          <LoginForm/>        </div>
          <Link href="/register">you don't have an account? <span className='text-2xl bould'>Register</span></Link>
      </div>
      </div>

      <div className="hidden md:flex w-1/2 p-12 items-center justify-center relative">
          <div className='max-w-lg space-y-6.text-white.z-10'>
            <h2 className='text-4xl text-black font-medium'>
              Join us to explore the best blog experience!
            </h2>
            <p className='text-right text-lg text-black font-bold'>Your company</p>
          </div>
          <div className="absolute inset-0 bg-black opacity-50">
            <img src="/blog-image-1.jpg" alt="" className='absolute inset-0 object-fit-cover w-full h-full'/>
          </div>
      </div>
    </div>
  )
}

export default LoginPage