import Link from "next/link";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { ecosystems } from "@/data/taxonomy";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <WebuosLogo size="sm" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">The global business discovery platform. Search companies, products, services and industries in one place.</p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ecosystems</h3>
            <ul className="space-y-2">
              {ecosystems.map(e => (
                <li key={e.id}><Link href={`/business-taxonomy/${e.id}`} className="text-sm text-foreground/80 hover:text-foreground">{e.shortName}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/register" className="text-sm text-foreground/80 hover:text-foreground">Create Account</Link></li>
              <li><Link href="/login" className="text-sm text-foreground/80 hover:text-foreground">Sign In</Link></li>
              <li><Link href="/business-taxonomy" className="text-sm text-foreground/80 hover:text-foreground">Taxonomy</Link></li>
              <li><Link href="/dashboard" className="text-sm text-foreground/80 hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-foreground/80">About WEBUOS</span></li>
              <li><span className="text-sm text-foreground/80">Privacy</span></li>
              <li><span className="text-sm text-foreground/80">Terms</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} WEBUOS. Global Business Discovery Platform.</p>
          <p className="text-xs text-muted-foreground">Build · Produce · Operate — Digital · Data · Intelligence — People · Capital · Services</p>
        </div>
      </div>
    </footer>
  );
}
