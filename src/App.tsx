import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onToggleLogin={() => setShowRegister(false)} />
    ) : (
      <Login onToggleRegister={() => setShowRegister(true)} />
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'driver':
      return <DriverDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-red-600">Papel de usuário inválido</div>
        </div>
      );
  }
}

export default App;
