'use client';

import Navbar from '@/components/Navbar';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function AuthLayout ({children}:{children: React.ReactNode;}) {
  const {token} = useAuth();
  const router = useRouter();

  useEffect( () =>{
    if( token) router.push('/');
  }, [token, router]);

  if(token){
    return null;
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
