import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { verifyAdminSession } from '@/lib/auth';
import { FolderLock, Calendar, Scale, ShieldCheck, Plus, FileText, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CasesPortalPage() {
  const auth = await verifyAdminSession();
  const supabase = getServiceSupabase();

  const { data: casesData } = await supabase
    .from('cases')
    .select('*, court:court_id(court_name), case_type:case_type_id(case_type), assistant:assistant_id(assistant_name), case_documents(count)')
    .order('created_at', { ascending: false });

  const cases = casesData && casesData.length > 0 ? casesData : [
    {
      case_id: 1,
      case_no: 'NX-2025-001',
      plaintiff_name: 'Del Rosario Energy Holdings',
      defendants_name: 'Apex Sovereign Infrastructure Ltd.',
      under_section: 'Sec. 12(a) Commercial Arbitration Act',
      filing_date: '2025-02-15',
      status: 'active',
      court: { court_name: 'Commercial & Arbitration Tribunal' },
      case_type: { case_type_type: 'Corporate & Commercial Litigation' },
    },
    {
      case_id: 2,
      case_no: 'NX-2025-002',
      plaintiff_name: 'Kavita Patel (VP Operations)',
      defendants_name: 'Zenith Global Logistics Corp.',
      under_section: 'Labor Code Title III, Section 282',
      filing_date: '2025-03-01',
      status: 'active',
      court: { court_name: 'Labour & Employment Relations Court' },
      case_type: { case_type_type: 'Labour & Executive Employment' },
    },
    {
      case_id: 3,
      case_no: 'NX-2025-003',
      plaintiff_name: 'Pacific Maritime Syndicate',
      defendants_name: 'Port Regulatory Commission',
      under_section: 'Constitutional Article III, Due Process',
      filing_date: '2025-01-20',
      status: 'active',
      court: { court_name: 'Supreme Court (Appellate Division)' },
      case_type: { case_type_type: 'Constitutional & Appellate' },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border-gold/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy to-neutral-900 border border-gold/40 flex items-center justify-center text-gold shadow-lg flex-shrink-0">
            <FolderLock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-2xl text-white">Client Case Docket &amp; Vault</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-burgundy/40 text-gold border border-burgundy">
                Isolated Vault Active
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-0.5">
              Secure client records preservation and real-time hearing docket management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {auth.isValid ? (
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-burgundy to-burgundy-light hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Admin Console</span>
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-neutral-900 text-neutral-300 hover:text-gold text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Staff Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* DOCKET TABLE */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-neutral-800 space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-white">Active Matter Register</h2>
            <p className="text-neutral-400 text-xs">Official dockets with isolated document vault attachments.</p>
          </div>
          <span className="text-xs font-mono text-gold">{cases.length} Registered Matters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Docket Number</th>
                <th className="py-3 px-4">Client / Matter</th>
                <th className="py-3 px-4">Court / Tribunal</th>
                <th className="py-3 px-4">Filing Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {cases.map((c: any) => (
                <tr key={c.case_id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-gold">{c.case_no}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-white block">{c.plaintiff_name}</span>
                    <span className="text-neutral-500 text-[11px] block mt-0.5">vs. {c.defendants_name}</span>
                  </td>
                  <td className="py-4 px-4 text-neutral-300">
                    {c.court?.court_name || 'Tribunal Forum'}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-neutral-400">{c.filing_date}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
                      {c.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-gold border border-neutral-800 transition-colors inline-flex items-center gap-1.5 text-xs"
                    >
                      <FolderLock className="w-3.5 h-3.5 text-gold" />
                      <span>Vault Files</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
