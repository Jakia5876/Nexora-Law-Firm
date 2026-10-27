import Link from 'next/link';
import { Scale, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-burgundy/40 border border-gold/40 flex items-center justify-center text-gold">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-white text-base">NEXORA LAW FIRM</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Premier legal counsel in Corporate Litigation, Cross-Border M&A, Intellectual Property, and White-Collar Defense.
          </p>
        </div>

        <div>
          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-gold">Chambers</h4>
          <ul className="space-y-2.5">
            <li><Link href="/practice-areas" className="hover:text-gold transition-colors">Practice Areas</Link></li>
            <li><Link href="/attorneys" className="hover:text-gold transition-colors">Attorneys & Partners</Link></li>
            <li><Link href="/cases" className="hover:text-gold transition-colors">Client Case Portal</Link></li>
            <li><Link href="/admin" className="hover:text-gold transition-colors">Role-Gated Management</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-gold">Practice Areas</h4>
          <ul className="space-y-2.5">
            <li><Link href="/practice-areas/corporate-litigation" className="hover:text-gold transition-colors">Corporate Litigation</Link></li>
            <li><Link href="/practice-areas/criminal-defense" className="hover:text-gold transition-colors">White Collar Defense</Link></li>
            <li><Link href="/practice-areas/intellectual-property" className="hover:text-gold transition-colors">Intellectual Property</Link></li>
            <li><Link href="/practice-areas/real-estate-land" className="hover:text-gold transition-colors">Real Estate & Land</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-gold">Contact Intake</h4>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gold flex-shrink-0" />
            <span>+1 (800) 555-0199</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold flex-shrink-0" />
            <span>contact@nexoralaw.com</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <span>742 Evergreen Terrace, Suite 500, New York, NY 10001</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-neutral-900 text-center text-neutral-500 text-[11px]">
        &copy; {new Date().getFullYear()} Nexora Law Firm Chambers. All rights reserved. Attorney Advertising.
      </div>
    </footer>
  );
}
