import  { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import ContentManagement from './ContentManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import StudyHubManagement from './StudyHubManagement';

function AdminLayout() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
      case 'StudyHub':
        return <StudyHubManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="text-center py-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
