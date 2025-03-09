import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 container mx-auto px-4 py-8 pb-24">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}