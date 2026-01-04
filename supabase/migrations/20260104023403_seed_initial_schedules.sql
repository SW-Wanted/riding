/*
  # Seed Initial Schedules

  ## Overview
  Populate initial schedules for both universities with common routes
  
  ## Changes
  1. Add morning, afternoon, and night schedules for ISPTEC
  2. Add morning, afternoon, and night schedules for Oscar Ribas
  3. Each schedule includes:
     - Specific route
     - Shift type (morning_go, morning_return, afternoon_go, afternoon_return, night_return)
     - Departure times (6:30, 8:00, 12:30, 14:00, 18:00)
     - Days of week (Monday to Friday)
     - Capacity (40 passengers per schedule)
*/

-- Get university IDs
DO $$
DECLARE
  isptec_id uuid;
  oscar_ribas_id uuid;
  viana_route_id uuid;
  golf2_route_id uuid;
  shoprite_route_id uuid;
  zango_route_id uuid;
  camama1_route_id uuid;
  rotunda_route_id uuid;
  talatona_route_id uuid;
BEGIN
  -- Get university IDs
  SELECT id INTO isptec_id FROM universities WHERE name = 'ISPTEC';
  SELECT id INTO oscar_ribas_id FROM universities WHERE name = 'Oscar Ribas';
  
  -- Get route IDs
  SELECT id INTO viana_route_id FROM routes WHERE name = 'Viana';
  SELECT id INTO golf2_route_id FROM routes WHERE name = 'Golf 2';
  SELECT id INTO shoprite_route_id FROM routes WHERE name = 'Shoprite Palanca';
  SELECT id INTO zango_route_id FROM routes WHERE name = 'Desvio do Zango';
  SELECT id INTO camama1_route_id FROM routes WHERE name = 'Camama 1';
  SELECT id INTO rotunda_route_id FROM routes WHERE name = 'Rotunda do Camama';
  SELECT id INTO talatona_route_id FROM routes WHERE name = 'Talatona (Universidades)';

  -- ISPTEC Schedules
  -- Morning Go (from different routes to university)
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (isptec_id, viana_route_id, 'morning_go', '06:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, golf2_route_id, 'morning_go', '06:45:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, shoprite_route_id, 'morning_go', '07:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, zango_route_id, 'morning_go', '07:15:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, camama1_route_id, 'morning_go', '07:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, rotunda_route_id, 'morning_go', '07:45:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Morning Return (from university to different routes)
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (isptec_id, viana_route_id, 'morning_return', '12:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, golf2_route_id, 'morning_return', '12:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, shoprite_route_id, 'morning_return', '12:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, zango_route_id, 'morning_return', '12:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Afternoon Go
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (isptec_id, viana_route_id, 'afternoon_go', '12:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, camama1_route_id, 'afternoon_go', '13:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, rotunda_route_id, 'afternoon_go', '13:15:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Afternoon Return
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (isptec_id, viana_route_id, 'afternoon_return', '17:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, golf2_route_id, 'afternoon_return', '17:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, shoprite_route_id, 'afternoon_return', '17:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Night Return
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (isptec_id, viana_route_id, 'night_return', '21:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, golf2_route_id, 'night_return', '21:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (isptec_id, camama1_route_id, 'night_return', '21:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Oscar Ribas Schedules
  -- Morning Go
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (oscar_ribas_id, viana_route_id, 'morning_go', '06:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (oscar_ribas_id, golf2_route_id, 'morning_go', '06:45:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (oscar_ribas_id, zango_route_id, 'morning_go', '07:15:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Morning Return
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (oscar_ribas_id, viana_route_id, 'morning_return', '12:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (oscar_ribas_id, golf2_route_id, 'morning_return', '12:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Afternoon Go
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (oscar_ribas_id, camama1_route_id, 'afternoon_go', '13:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (oscar_ribas_id, rotunda_route_id, 'afternoon_go', '13:15:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Afternoon Return
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (oscar_ribas_id, viana_route_id, 'afternoon_return', '17:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (oscar_ribas_id, shoprite_route_id, 'afternoon_return', '17:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

  -- Night Return
  INSERT INTO schedules (university_id, route_id, shift, departure_time, days_of_week, capacity, active)
  VALUES
    (oscar_ribas_id, viana_route_id, 'night_return', '21:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true),
    (oscar_ribas_id, camama1_route_id, 'night_return', '21:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 40, true)
  ON CONFLICT DO NOTHING;

END $$;