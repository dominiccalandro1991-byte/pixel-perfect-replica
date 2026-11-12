import { Link, useRouterState } from '@tanstack/react-router';
import { House, MapPin, Sparkles, CalendarDays, UserRound, Lightbulb, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import type { ReactNode } from 'react';

const nav = [{to:'/' as const,label:'Home',icon:House},{to:'/map' as const,label:'Live map',icon:MapPin},{to:'/feed' as const,label:'Community',icon:Sparkles},{to:'/dashboard' as const,label:'My bookings',icon:CalendarDays}];
export function Brand(){return <span className="brand"><Lightbulb className="brand-mark" strokeWidth={1.5}/><span>Holiday<em>FX</em><span className="text-gold text-lg">.</span></span></span>;}
export function AppShell({children}:{children:ReactNode}){
 const path=useRouterState({select:s=>s.location.pathname}); const {user}=useAuth();
 return <><header className="app-header"><Link to="/" aria-label="HolidayFX home"><Brand/></Link><nav className="desktop-nav">{nav.map(({to,label,icon:Icon})=><Link key={to} to={to} className={path===to?'active':''}><Icon size={14}/>{label}</Link>)}</nav><div className="flex items-center gap-4"><Button asChild className="header-cta" size="sm"><Link to="/book">Get a quote <ArrowUpRight/></Link></Button><Button variant="ghost" size="icon" asChild><Link to={user?'/settings':'/auth'} aria-label={user?'Your account':'Sign in'}><UserRound size={19}/></Link></Button></div></header><main>{children}</main>{path!='/map'&&<footer className="app-footer"><Brand/><span>© {new Date().getFullYear()} HolidayFX</span></footer>}<nav className="bottom-nav">{[...nav,{to:'/settings' as const,label:'Profile',icon:UserRound}].map(({to,label,icon:Icon})=><Link key={to} to={to} className={path===to?'active':''}><Icon/><span>{label}</span></Link>)}</nav></>;
}