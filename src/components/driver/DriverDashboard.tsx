import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Bus, Calendar, Clock, Users, LogOut, CheckCircle } from 'lucide-react';
import { Booking, Schedule, Route, User as UserType } from '../../types';

export default function DriverDashboard() {
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { student: UserType; schedule: Schedule & { route: Route } })[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [selectedDate]);

  const loadBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        student:users(*),
        schedule:schedules(*, route:routes(*))
      `)
      .eq('booking_date', selectedDate)
      .in('status', ['pending', 'confirmed'])
      .order('created_at', { ascending: true });

    if (data) setBookings(data);
    setLoading(false);
  };

  const checkInStudent = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          check_in_time: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) throw error;
      loadBookings();
    } catch (err) {
      console.error('Error checking in student:', err);
    }
  };

  const getShiftLabel = (shift: string) => {
    const labels: Record<string, string> = {
      morning_go: 'Manhã - Ida',
      morning_return: 'Manhã - Volta',
      afternoon_go: 'Tarde - Ida',
      afternoon_return: 'Tarde - Volta',
      night_return: 'Noite - Volta',
    };
    return labels[shift] || shift;
  };

  const groupedBookings = bookings.reduce((acc, booking) => {
    const scheduleId = booking.schedule_id;
    if (!acc[scheduleId]) {
      acc[scheduleId] = {
        schedule: booking.schedule,
        bookings: [],
      };
    }
    acc[scheduleId].bookings.push(booking);
    return acc;
  }, {} as Record<string, { schedule: Schedule & { route: Route }; bookings: typeof bookings }>);

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
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Motorista</h1>
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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data de Serviço</h2>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-6">
          {Object.entries(groupedBookings).length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma reserva para esta data</p>
            </div>
          ) : (
            Object.entries(groupedBookings).map(([scheduleId, { schedule, bookings }]) => (
              <div key={scheduleId} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {getShiftLabel(schedule.shift)}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.departure_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{bookings.length} passageiros</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Rota</div>
                    <div className="font-semibold text-gray-900">{schedule.route.name}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{booking.student.full_name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{booking.student.student_number}</span>
                          {booking.student.phone && <span>{booking.student.phone}</span>}
                        </div>
                        {booking.check_in_time && (
                          <div className="mt-2 text-xs text-green-600">
                            Check-in: {new Date(booking.check_in_time).toLocaleTimeString('pt-BR')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>

                        {booking.status === 'confirmed' ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Confirmado</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => checkInStudent(booking.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Check-in
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
