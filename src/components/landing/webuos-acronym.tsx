import { Globe, Building2, Briefcase, Link2, Settings, MonitorSmartphone } from "lucide-react";

const items = [
  { letter: "W", word: "World", emoji: "🌍", icon: Globe, desc: "Global reach, international markets, cross-border business, and worldwide connectivity.", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/30" },
  { letter: "E", word: "Enterprises", emoji: "🏢", icon: Building2, desc: "Companies, corporations, SMEs, startups, institutions, organizations, and business units.", gradient: "from-indigo-500 to-blue-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-500/30" },
  { letter: "B", word: "Business", emoji: "💼", icon: Briefcase, desc: "Commerce, marketplaces, procurement, sales, services, workforce, and business operations.", gradient: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-500/30" },
  { letter: "U", word: "Unified", emoji: "🔗", icon: Link2, desc: "Connects different business functions, applications, users, organizations, and workflows into one ecosystem.", gradient: "from-purple-500 to-fuchsia-500", bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-500/30" },
  { letter: "O", word: "Operating", emoji: "⚙️", icon: Settings, desc: "The platform operates and coordinates business processes, workflows, transactions, communication, data, and applications.", gradient: "from-fuchsia-500 to-pink-500", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400", border: "border-fuchsia-200 dark:border-fuchsia-500/30" },
  { letter: "S", word: "System", emoji: "🖥️", icon: MonitorSmartphone, desc: "A complete technology platform rather than a single application.", gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-500/30" },
];

export function WebuosAcronym() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-muted/20 py-16 sm:py-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">What does WEBUOS mean?</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">WEBUOS</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">World Enterprises Business Unified Operating System</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.letter} className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg ${item.border}`}>
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient}`} />
                <div className="mb-4 flex items-center justify-between">
                  <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg ${item.gradient}`}>{item.letter}</span>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${item.bg} ${item.text} ${item.border}`}><Icon className="h-5 w-5" /></span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{item.word}</h3>
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <p className={`mb-2 text-xs font-bold uppercase tracking-wider ${item.text}`}>{item.letter} — {item.word}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                <span className="mt-4 font-mono text-[10px] font-bold text-muted-foreground/40">{String(idx + 1).padStart(2, "0")}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-white shadow-lg"><span className="text-lg font-bold">W</span></span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full expansion</p>
              <p className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">WEBUOS</span>
                <span className="text-muted-foreground"> — World Enterprises Business Unified Operating System</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
