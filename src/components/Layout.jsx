import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className={`app-main ${collapsed ? 'app-main--collapsed' : ''}`}>
        <Header
          onToggleSidebar={() => setCollapsed(c => !c)}
          collapsed={collapsed}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
