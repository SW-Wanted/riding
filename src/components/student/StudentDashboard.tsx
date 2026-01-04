import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Bus, Calendar, Clock, MapPin, CreditCard, LogOut } from 'lucide-react';
import { Schedule, Route, Booking, University } from '../../types';

export default function StudentDashboard() {
  const { user, signOut } = useAuth();
  const [schedules, setSchedules] = useState<(Schedule & { route: Route; university: University })[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const { data: schedulesData } = await supabase
      .from('schedules')
      .select('*, route:routes(*), university:universities(*)')
      .eq('university_id', user.university_id)
      .eq('active', true);

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .eq('student_id', user.id)
      .gte('booking_date', new Date().toISOString().split('T')[0]);

    if (schedulesData) setSchedules(schedulesData);
    if (bookingsData) setBookings(bookingsData);
    setLoading(false);
  };

  const createBooking = async (scheduleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('bookings').insert({
        student_id: user.id,
        schedule_id: scheduleId,
        booking_date: selectedDate,
        status: 'pending',
        payment_status: 'pending',
      });

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error cancelling booking:', err);
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

  const isBooked = (scheduleId: string) => {
    return bookings.some(
      b => b.schedule_id === scheduleId &&
      b.booking_date === selectedDate &&
      b.status !== 'cancelled'
    );
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
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Transporte Universitário</h1>
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
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Selecionar Data</h2>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Horários Disponíveis</h2>
            </div>

            <div className="space-y-4">
              {schedules.map((schedule) => {
                const booked = isBooked(schedule.id);
                return (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getShiftLabel(schedule.shift)}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{schedule.departure_time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Capacidade</div>
                        <div className="font-semibold text-gray-900">{schedule.capacity}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.route.name}</span>
                    </div>

                    {booked ? (
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-medium text-sm">Reservado</span>
                        <button
                          onClick={() => {
                            const booking = bookings.find(
                              b => b.schedule_id === schedule.id &&
                              b.booking_date === selectedDate &&
                              b.status !== 'cancelled'
                            );
                            if (booking) cancelBooking(booking.id);
                          }}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => createBooking(schedule.id)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Reservar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Minhas Reservas</h2>
            </div>

            <div className="space-y-4">
              {bookings.filter(b => b.status !== 'cancelled').map((booking) => {
                const schedule = schedules.find(s => s.id === booking.schedule_id);
                if (!schedule) return null;

                return (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {getShiftLabel(schedule.shift)}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.booking_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.departure_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.route.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {bookings.filter(b => b.status !== 'cancelled').length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhuma reserva ativa
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informação de Pagamento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Diário</h3>
              <p className="text-2xl font-bold text-blue-600">1.500 Kz</p>
              <p className="text-sm text-gray-600 mt-1">Por viagem</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Semanal</h3>
              <p className="text-2xl font-bold text-blue-600">7.000 Kz</p>
              <p className="text-sm text-gray-600 mt-1">5 dias úteis</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Mensal</h3>
              <p className="text-2xl font-bold text-blue-600">25.000 Kz</p>
              <p className="text-sm text-gray-600 mt-1">20 dias úteis</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
