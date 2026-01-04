import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Bus, Calendar, MapPin, LogOut, Clock } from 'lucide-react';
import { User, Vehicle, Schedule, Booking, Route } from '../../types';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [schedules, setSchedules] = useState<(Schedule & { route: Route })[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDrivers: 0,
    activeBookings: 0,
    totalVehicles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [usersData, vehiclesData, schedulesData, bookingsData, routesData] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('vehicles').select('*'),
      supabase.from('schedules').select('*, route:routes(*)'),
      supabase.from('bookings').select('*').eq('status', 'confirmed'),
      supabase.from('routes').select('*'),
    ]);

    if (usersData.data) {
      setUsers(usersData.data);
      setStats(prev => ({
        ...prev,
        totalStudents: usersData.data.filter(u => u.role === 'student').length,
        totalDrivers: usersData.data.filter(u => u.role === 'driver').length,
      }));
    }

    if (vehiclesData.data) {
      setVehicles(vehiclesData.data);
      setStats(prev => ({ ...prev, totalVehicles: vehiclesData.data.length }));
    }

    if (schedulesData.data) setSchedules(schedulesData.data);
    if (routesData.data) setRoutes(routesData.data);

    if (bookingsData.data) {
      setBookings(bookingsData.data);
      setStats(prev => ({ ...prev, activeBookings: bookingsData.data.length }));
    }

    setLoading(false);
  };

  const createSchedule = async (scheduleData: Partial<Schedule>) => {
    try {
      const { error } = await supabase.from('schedules').insert(scheduleData);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error creating schedule:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel de Administração</h1>
                <p className="text-sm text-gray-600">{user?.full_name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estudantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Bus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Motoristas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reservas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <Bus className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Veículos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Horários</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{schedule.shift}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      schedule.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {schedule.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{schedule.departure_time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.route.name}</span>
                    </div>
                    <div>Capacidade: {schedule.capacity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Bus className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Veículos</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{vehicle.plate_number}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      vehicle.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {vehicle.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Modelo: {vehicle.model}</div>
                    <div>Capacidade: {vehicle.capacity} passageiros</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Rotas Disponíveis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {routes.map((route) => (
              <div key={route.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{route.name}</h3>
                </div>
                <div className="text-sm text-gray-600">
                  Ordem: {route.order_index}
                </div>
                {route.is_destination && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Destino
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
