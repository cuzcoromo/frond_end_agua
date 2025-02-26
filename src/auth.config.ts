
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import {z} from 'zod';
import httpRequest from './utils/httpRequest';



export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    callbacks:{
        jwt({token,user}) {
            if (user) {
                token.data = user
            }
            return token;
        },

        session({session, token}){
            if(token.data){
                session.user = token.data as any;
            }
            return session;
        },

    },


    //   TODO proveedores de auntenticacion
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                    if(!parsedCredentials.success) return null;
                    const data = await httpRequest('/signin', parsedCredentials.data, 'post');
        
                    if(!data || typeof data !== 'object') return null;

                    const {user} = data;
                    
                    if (!user || typeof user !== 'object' || Object.keys(user).length  === 0) {
                        return null;
                    }

                    if(!user?.id && !user?.email){
                        return null;
                    }
                    return data;
            },
        }),
    ]

};

export const { signIn, signOut, auth, handlers } = NextAuth( authConfig);