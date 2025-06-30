'use client';

import '@/app/globals.css';
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import MnavBar from '@/components/MnavBar';
import NavBar from '@/components/NavBar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const [hideMobileUI, setHideMobileUI] = useState(false);

 useEffect(() => {
    // List of route patterns where mobile UI should be hidden
    const excludedRoutePatterns = [
      '/community',
      '/friends/chat' // This will match any route starting with /friends/chat
    ];

    // Check if current pathname matches any excluded pattern
    const shouldHide = excludedRoutePatterns.some(pattern => 
      pathname.startsWith(pattern)
    );

    setHideMobileUI(shouldHide);
  }, [pathname]);

  return (
    <div className="flex">
      {/* Optional Navbars */}
      {!hideMobileUI && <MnavBar />}
      
      


        
        <NavBar />
        
      
      {/* Sidebar (Desktop only) */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-72 z-50">
        
        <Menu />
        
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-72 overflow-y-auto h-full ">
        {children}
      </main>

      {/* Bottom Nav (Mobile only) */}
      {!hideMobileUI && (
        <div className="md:hidden fixed bottom-0 w-full z-50">
          <BottomMenu />
        </div>
      )}
    </div>
  );
}
