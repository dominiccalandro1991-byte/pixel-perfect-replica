import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

const AuthContext = createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({children}:{children:ReactNode}) {
  const [user,setUser] = useState<User|null>(null);
  const [ready,setReady] = useState(false);
  const queryClient=useQueryClient(); const router=useRouter();
  useEffect(()=>{
    let alive=true;
    supabase.auth.getUser().then(({data})=>{ if(alive){setUser(data.user);setReady(true);} });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==='INITIAL_SESSION') {setUser(session?.user??null);setReady(true);return;}
      if(!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) return;
      setUser(session?.user??null);setReady(true);
      if(event==='SIGNED_OUT') queryClient.removeQueries({queryKey:['account']});
      else queryClient.invalidateQueries();
      router.invalidate();
    });
    return ()=>{alive=false;subscription.unsubscribe();};
  },[queryClient,router]);
  return <AuthContext.Provider value={{user,ready}}>{children}</AuthContext.Provider>;
}