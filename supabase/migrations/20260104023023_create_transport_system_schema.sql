/*
  # Transport System for Angolan Universities

  ## Overview
  Complete schema for university transport service in Angola (Luanda)
  
  ## New Tables
  
  ### 1. users
    - `id` (uuid, primary key) - Unique user identifier
    - `email` (text, unique) - Institutional email (e.g., 20230429@isptec.co.ao)
    - `full_name` (text) - Student/staff full name
    - `phone` (text) - Contact phone number
    - `role` (text) - User role: 'admin', 'driver', 'student'
    - `student_number` (text) - Student ID number
    - `university_id` (uuid) - Reference to university
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. universities
    - `id` (uuid, primary key) - Unique university identifier
    - `name` (text) - University name (ISPTEC, Oscar Ribas)
    - `email_domain` (text) - Email domain for validation (@isptec.co.ao)
    - `address` (text) - University location in Luanda
    - `active` (boolean) - Whether university is active
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 3. routes
    - `id` (uuid, primary key) - Unique route identifier
    - `name` (text) - Route name (Viana, Golf 2, etc.)
    - `order_index` (integer) - Order in the route sequence
    - `is_destination` (boolean) - Whether this is final destination (Talatona)
    - `active` (boolean) - Whether route is currently active
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 4. schedules
    - `id` (uuid, primary key) - Unique schedule identifier
    - `university_id` (uuid) - Reference to university
    - `route_id` (uuid) - Reference to route
    - `shift` (text) - Shift: 'morning_go', 'morning_return', 'afternoon_go', 'afternoon_return', 'night_return'
    - `departure_time` (time) - Departure time
    - `days_of_week` (text array) - Days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    - `capacity` (integer) - Available seats
    - `active` (boolean) - Whether schedule is active
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 5. vehicles
    - `id` (uuid, primary key) - Unique vehicle identifier
    - `plate_number` (text, unique) - Vehicle license plate
    - `model` (text) - Vehicle model
    - `capacity` (integer) - Total passenger capacity
    - `driver_id` (uuid) - Reference to driver user
    - `active` (boolean) - Whether vehicle is active
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 6. bookings
    - `id` (uuid, primary key) - Unique booking identifier
    - `student_id` (uuid) - Reference to student user
    - `schedule_id` (uuid) - Reference to schedule
    - `booking_date` (date) - Date of the trip
    - `status` (text) - Status: 'pending', 'confirmed', 'completed', 'cancelled'
    - `payment_status` (text) - Payment status: 'pending', 'paid'
    - `check_in_time` (timestamptz) - When student checked in
    - `created_at` (timestamptz) - Booking creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp
  
  ### 7. payments
    - `id` (uuid, primary key) - Unique payment identifier
    - `student_id` (uuid) - Reference to student user
    - `payment_type` (text) - Type: 'daily', 'weekly', 'monthly'
    - `amount` (decimal) - Payment amount in Kwanzas
    - `start_date` (date) - Payment period start date
    - `end_date` (date) - Payment period end date
    - `status` (text) - Status: 'pending', 'completed', 'failed'
    - `payment_method` (text) - Payment method used
    - `created_at` (timestamptz) - Payment creation timestamp
  
  ## Security
  - Enable RLS on all tables
  - Create policies for each user role
  - Students can only see their own data
  - Drivers can see assigned trips
  - Admins have full access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('admin', 'driver', 'student')),
  student_number text,
  university_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email_domain text NOT NULL UNIQUE,
  address text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index integer NOT NULL,
  is_destination boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid REFERENCES universities(id) ON DELETE CASCADE,
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  shift text NOT NULL CHECK (shift IN ('morning_go', 'morning_return', 'afternoon_go', 'afternoon_return', 'night_return')),
  departure_time time NOT NULL,
  days_of_week text[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  capacity integer NOT NULL DEFAULT 40,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text UNIQUE NOT NULL,
  model text NOT NULL,
  capacity integer NOT NULL DEFAULT 40,
  driver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES schedules(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  check_in_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  payment_type text NOT NULL CHECK (payment_type IN ('daily', 'weekly', 'monthly')),
  amount decimal(10,2) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for university_id in users
ALTER TABLE users ADD CONSTRAINT fk_university 
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for universities
CREATE POLICY "Anyone can view active universities"
  ON universities FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage universities"
  ON universities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for routes
CREATE POLICY "Anyone can view active routes"
  ON routes FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage routes"
  ON routes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for schedules
CREATE POLICY "Anyone can view active schedules"
  ON schedules FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage schedules"
  ON schedules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for vehicles
CREATE POLICY "Anyone can view active vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Students can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Drivers can view assigned bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('driver', 'admin')
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for payments
CREATE POLICY "Students can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Insert initial data for universities
INSERT INTO universities (name, email_domain, address, active) VALUES
  ('ISPTEC', '@isptec.co.ao', 'Talatona, Luanda', true),
  ('Oscar Ribas', '@oscarribas.co.ao', 'Talatona, Luanda', true)
ON CONFLICT (email_domain) DO NOTHING;

-- Insert routes
INSERT INTO routes (name, order_index, is_destination, active) VALUES
  ('Viana', 1, false, true),
  ('Golf 2', 2, false, true),
  ('Shoprite Palanca', 3, false, true),
  ('Desvio do Zango', 4, false, true),
  ('Camama 1', 5, false, true),
  ('Rotunda do Camama', 6, false, true),
  ('Talatona (Universidades)', 7, true, true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_schedules_university ON schedules(university_id);