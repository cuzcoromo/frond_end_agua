
import { auth } from '@/auth.config';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AuthLayout ({children}:{children: React.ReactNode;}) {
  const session = await auth();

  if(session){
    redirect('/');
  }

  return (
    <main className='flex flex-col min-h-screen'>
        <Navbar/>

        <div className='flex flex-1 overflow-hidden justify-center items-center'>
        {children}
        </div>
    </main>
    
  )
}
