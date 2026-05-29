// src/app/page.js
import { supabase } from '@/lib/supabase';
import ClientDashboard from '@/components/ClientDashboard';

export const revalidate = 0; // Force dynamic data streaming

export default async function Page() {
  // Pull drop matrices directly from data ledger
  const { data: drops } = await supabase
    .from('drops')
    .select(`
      *,
      sponsors (*),
      winners (*)
    `)
    .order('drop_number', { ascending: false });

  // Aggregate transactional statistics across entire dataset
  const { data: statsData } = await supabase
    .from('winners')
    .select('amount');

  const totalDistributed = statsData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
  const totalDrops = drops?.length || 0;

  const stats = {
    total_distributed: totalDistributed,
    total_drops: totalDrops
  };

  return (
    <ClientDashboard 
      initialDrops={drops || []} 
      stats={stats} 
    />
  );
}