// src/app/admin/page.jsx
import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/AdminDashboard'; 

export const revalidate = 0;

export default async function AdminPage() {
  const { data: drops } = await supabase
    .from('drops')
    .select(`*, sponsors (*), winners (*)`)
    .order('drop_number', { ascending: false });

  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('*')
    .order('name', { ascending: true });

  return (
    <AdminDashboard 
      initialDrops={drops || []} 
      sponsorsList={sponsors || []} 
    />
  );
}