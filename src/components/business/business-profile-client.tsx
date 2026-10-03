"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Building2, MapPin, BadgeCheck, Star, Package, Wrench, ArrowRight,
  Bookmark, Share2, Phone, Mail, Globe, Clock, Users, Calendar,
  Award, Network, TrendingUp, ChevronRight, ExternalLink,
  CheckCircle2, AlertCircle, Linkedin, Twitter, Facebook,
  ShoppingBag, FileText, Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { accentText, getColor } from "@/lib/colors";
import type { BusinessProfileData } from "@/app/business/[slug]/page";

interface Props {
  data: BusinessProfileData;
  accent: "gold" | "blue" | "purple";
}

export function BusinessProfileClient({ data, accent }: Props) {
  const { company, products, services, related_companies } = data;
  const [saved, setSaved] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const initials = company.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const color = getColor(accent === "gold" ? "amber" : accent === "purple" ? "purple" : "blue");

  function trackEvent(eventType: string) {
    startTransition(async () => {
      try {
        await fetch("/api/search/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: eventType,
            query: company.name,
            result_count: 1,
            session_id: typeof window !== "undefined" ? sessionStorage.getItem("webuos-session") ?? "" : "",
          }),
        });
      } catch {
        // best-effort
      }
    });
  }

  function handleSave() {
    setSaved((s) => !s);
    trackEvent("save_business");
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: company.name,
          text: company.description ?? company.name,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  function handleContact() {
    setContactOpen((o) => !o);
    trackEvent("contact_business");
  }

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8"
        >
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/search" className="hover:text-foreground">Search</Link>
          <ChevronRight className="h-3 w-3" />
          {company.industry && (
            <>
              <Link href={`/search?q=${encodeURIComponent(company.industry)}&type=company`} className="hover:text-foreground">{company.industry}</Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="font-medium text-foreground">{company.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header card */}
        <Card className={cn("overflow-hidden border-t-4 p-0", color.border)} style={{ borderTopColor: accent === "gold" ? "#f59e0b" : accent === "purple" ? "#a855f7" : "#3b82f6" }}>
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[auto,1fr,auto]">
            {/* Logo */}
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ring-2",
                  color.iconBg,
                  color.iconText,
                  color.border,
                )}
                aria-label={`${company.name} logo`}
              >
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  initials || <Building2 className="h-9 w-9" />
                )}
              </div>
            </div>

            {/* Title + meta */}
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                  {company.name}
                </h1>
                {company.verified && (
                  <Badge className="gap-1 border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified Business
                  </Badge>
                )}
                {company.claimed && (
                  <Badge variant="outline" className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Claimed
                  </Badge>
                )}
                {company.pendingVerification && (
                  <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" /> Pending Verification
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
                {company.business_type && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground/80">{company.business_type}</span>
                  </span>
                )}
                {company.industry && (
                  <span className="inline-flex items-center gap-1">
                    <Network className="h-3.5 w-3.5" />
                    {company.industry}
                  </span>
                )}
                {company.category && (
                  <span className="inline-flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    {company.category}
                  </span>
                )}
                {company.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {[company.city, company.state, company.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>

              {company.rating > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "h-4 w-4",
                          n <= Math.round(company.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">{company.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({company.review_count} reviews)</span>
                </div>
              )}

              {company.description && (
                <p className="line-clamp-3 max-w-3xl text-sm text-muted-foreground sm:text-[15px]">
                  {company.description}
                </p>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs text-muted-foreground">
                {company.founded_year && (
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Founded {company.founded_year}</span>
                )}
                {company.employee_range && (
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {company.employee_range} employees</span>
                )}
                {company.business_size && (
                  <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {company.business_size}</span>
                )}
                {company.annual_revenue && (
                  <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {company.annual_revenue}</span>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              <Button onClick={handleContact} className="gap-1.5" disabled={pending}>
                <Phone className="h-4 w-4" /> Contact Business
              </Button>
              <Button asChild variant="secondary" className="gap-1.5">
                <Link href="#products">
                  <Package className="h-4 w-4" /> View Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-1.5">
                <Link href="#services">
                  <Wrench className="h-4 w-4" /> View Services
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleSave} variant={saved ? "default" : "outline"} size="sm" className="flex-1 gap-1.5">
                  <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm" className="gap-1.5" aria-label="Share business">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact panel (collapsible) */}
        {contactOpen && (
          <Card className="mt-4 p-5" style={{ animation: "fadeIn .2s ease-out" }}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Phone className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</span>
                    <span className="block truncate text-sm font-medium text-foreground">{company.phone}</span>
                  </span>
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"><Mail className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
                    <span className="block truncate text-sm font-medium text-foreground">{company.email}</span>
                  </span>
                </a>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400"><Globe className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Website</span>
                    <span className="block truncate text-sm font-medium text-foreground">{company.website.replace(/^https?:\/\//, "")}</span>
                  </span>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </a>
              )}
              {company.business_hours && (
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"><Clock className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Business Hours</span>
                    <span className="block text-sm font-medium text-foreground">{company.business_hours}</span>
                  </span>
                </div>
              )}
              {company.address && (
                <div className="flex items-start gap-3 rounded-lg border border-border p-3 sm:col-span-2 lg:col-span-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400"><MapPin className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Address</span>
                    <span className="block text-sm font-medium text-foreground">{company.address}</span>
                    <span className="block text-xs text-muted-foreground">
                      {[company.district, company.city, company.state, company.country, company.postal_code].filter(Boolean).join(", ")}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tabs section */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="flex w-full flex-wrap items-center justify-start gap-1 h-auto bg-muted/40 p-1">
            <TabsTrigger value="overview" className="gap-1.5">Overview</TabsTrigger>
            <TabsTrigger value="products" className="gap-1.5">
              <Package className="h-3.5 w-3.5" /> Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-1.5">
              <Wrench className="h-3.5 w-3.5" /> Services ({services.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-1.5">About</TabsTrigger>
            <TabsTrigger value="contact" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Contact
            </TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="mt-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                {company.description && (
                  <Card className="p-5">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">About {company.name}</h2>
                    <p className="text-sm leading-relaxed text-foreground/90 sm:text-[15px]">{company.description}</p>
                  </Card>
                )}

                {products.length > 0 && (
                  <Card id="products" className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <Package className="h-4 w-4" /> Featured Products
                      </h2>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        View all <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {products.slice(0, 4).map((p) => (
                        <div key={p.id} className="rounded-xl border border-border bg-card/40 p-3 transition-colors hover:bg-muted/40">
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-tight text-foreground">{p.name}</h3>
                            {p.availability && (
                              <Badge variant="outline" className={cn("shrink-0 text-[10px]", p.availability === "In Stock" ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "border-amber-500/30 text-amber-600 dark:text-amber-400")}>
                                {p.availability}
                              </Badge>
                            )}
                          </div>
                          {p.description && <p className="line-clamp-2 text-xs text-muted-foreground">{p.description}</p>}
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            {p.brand && <span>Brand: <span className="font-medium text-foreground/70">{p.brand}</span></span>}
                            {p.price_range && <span>Price: <span className="font-medium text-foreground/70">{p.price_range}</span></span>}
                            {p.moq && <span>MOQ: <span className="font-medium text-foreground/70">{p.moq}</span></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {services.length > 0 && (
                  <Card id="services" className="p-5">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      <Wrench className="h-4 w-4" /> Featured Services
                    </h2>
                    <div className="space-y-2.5">
                      {services.slice(0, 5).map((s) => (
                        <div key={s.id} className="rounded-xl border border-border bg-card/40 p-3 transition-colors hover:bg-muted/40">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                              {s.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>}
                              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                {s.industry_served && <span>Serves: <span className="font-medium text-foreground/70">{s.industry_served}</span></span>}
                                {s.coverage && <span>Coverage: <span className="font-medium text-foreground/70">{s.coverage}</span></span>}
                                {s.pricing_model && <span>Pricing: <span className="font-medium text-foreground/70">{s.pricing_model}</span></span>}
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs">
                              <Send className="h-3 w-3" /> Inquire
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-5">
                <Card className="p-5">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Business Profile</h2>
                  <dl className="space-y-2 text-sm">
                    {company.business_type && <ProfileRow icon={Building2} label="Business Type" value={company.business_type} />}
                    {company.business_size && <ProfileRow icon={Building2} label="Business Size" value={company.business_size} />}
                    {company.founded_year && <ProfileRow icon={Calendar} label="Founded" value={String(company.founded_year)} />}
                    {company.employee_range && <ProfileRow icon={Users} label="Employees" value={company.employee_range} />}
                    {company.annual_revenue && <ProfileRow icon={TrendingUp} label="Annual Revenue" value={company.annual_revenue} />}
                    {company.ecosystem && <ProfileRow icon={Network} label="Ecosystem" value={company.ecosystem === "industrial" ? "Industrial Engineering & Manufacturing" : company.ecosystem === "technology-ai" ? "Information Technology & AI" : "Professional, Commercial & Business Services"} />}
                    {company.views > 0 && <ProfileRow icon={TrendingUp} label="Profile Views" value={company.views.toLocaleString()} />}
                  </dl>
                </Card>

                {company.certifications.length > 0 && (
                  <Card className="p-5">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      <Award className="h-4 w-4" /> Certifications
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {company.certifications.map((c) => (
                        <Badge key={c} variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                          <Award className="h-3 w-3" /> {c}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {company.industries_served.length > 0 && (
                  <Card className="p-5">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Industries Served</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {company.industries_served.map((i) => (
                        <Link key={i} href={`/search?q=${encodeURIComponent(i)}&type=company`}>
                          <Badge variant="outline" className="cursor-pointer hover:border-primary/40 hover:bg-primary/5">
                            {i}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}

                {company.markets_served.length > 0 && (
                  <Card className="p-5">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Markets Served</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {company.markets_served.map((m) => (
                        <Badge key={m} variant="secondary">{m}</Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {company.social_links && Object.keys(company.social_links).length > 0 && (
                  <Card className="p-5">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Social Links</h2>
                    <div className="flex flex-wrap gap-2">
                      {company.social_links.linkedin && (
                        <a href={company.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-blue-600 transition-colors hover:bg-blue-500/10 dark:text-blue-400">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {company.social_links.twitter && (
                        <a href={company.social_links.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sky-500 transition-colors hover:bg-sky-500/10">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {company.social_links.facebook && (
                        <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-blue-700 transition-colors hover:bg-blue-700/10">
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Products tab */}
          <TabsContent value="products" className="mt-5">
            {products.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <Card key={p.id} className="overflow-hidden p-0 transition-all hover:shadow-soft-lg">
                    <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-500/40">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-tight text-foreground">{p.name}</h3>
                        {p.availability && (
                          <Badge variant="outline" className={cn("shrink-0 text-[10px]", p.availability === "In Stock" ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "border-amber-500/30 text-amber-600 dark:text-amber-400")}>
                            {p.availability}
                          </Badge>
                        )}
                      </div>
                      {p.description && <p className="line-clamp-3 text-xs text-muted-foreground">{p.description}</p>}
                      <Separator className="my-3" />
                      <div className="space-y-1 text-[11px] text-muted-foreground">
                        {p.brand && <div>Brand: <span className="font-medium text-foreground/70">{p.brand}</span></div>}
                        {p.category && <div>Category: <span className="font-medium text-foreground/70">{p.category}</span></div>}
                        {p.moq && <div>MOQ: <span className="font-medium text-foreground/70">{p.moq}</span></div>}
                        {p.price_range && <div>Price: <span className="font-medium text-foreground/70">{p.price_range}</span></div>}
                      </div>
                      <Button size="sm" variant="outline" className="mt-3 w-full gap-1.5" onClick={() => trackEvent("request_quote")}>
                        <Send className="h-3.5 w-3.5" /> Request Quote
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No products listed by this company yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Services tab */}
          <TabsContent value="services" className="mt-5">
            {services.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((s) => (
                  <Card key={s.id} className="p-4 transition-all hover:shadow-soft-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground">{s.name}</h3>
                        {s.category && <Badge variant="outline" className="mt-1 text-[10px]">{s.category}</Badge>}
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => trackEvent("contact_business")}>
                        <Phone className="h-3.5 w-3.5" /> Inquire
                      </Button>
                    </div>
                    {s.description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>}
                    <Separator className="my-3" />
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
                      {s.industry_served && <div className="flex flex-col"><span className="font-semibold uppercase tracking-wider text-muted-foreground/70">Serves</span><span className="text-foreground/80">{s.industry_served}</span></div>}
                      {s.coverage && <div className="flex flex-col"><span className="font-semibold uppercase tracking-wider text-muted-foreground/70">Coverage</span><span className="text-foreground/80">{s.coverage}</span></div>}
                      {s.pricing_model && <div className="flex flex-col"><span className="font-semibold uppercase tracking-wider text-muted-foreground/70">Pricing</span><span className="text-foreground/80">{s.pricing_model}</span></div>}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center">
                <Wrench className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No services listed by this company yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* About tab */}
          <TabsContent value="about" className="mt-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                <Card className="p-6">
                  <h2 className="mb-3 text-lg font-bold text-foreground">About {company.name}</h2>
                  <p className="text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                    {company.description ?? `${company.name} is a ${company.business_type.toLowerCase()} based in ${company.city}, ${company.country}.`}
                  </p>
                  <Separator className="my-4" />
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ProfileRow icon={Building2} label="Business Type" value={company.business_type} />
                    {company.business_size && <ProfileRow icon={Building2} label="Business Size" value={company.business_size} />}
                    {company.founded_year && <ProfileRow icon={Calendar} label="Founded Year" value={String(company.founded_year)} />}
                    {company.employee_range && <ProfileRow icon={Users} label="Employees" value={company.employee_range} />}
                    {company.annual_revenue && <ProfileRow icon={TrendingUp} label="Annual Revenue" value={company.annual_revenue} />}
                    {company.business_hours && <ProfileRow icon={Clock} label="Business Hours" value={company.business_hours} />}
                  </dl>
                </Card>

                {company.certifications.length > 0 && (
                  <Card className="p-6">
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                      <Award className="h-5 w-5 text-emerald-500" /> Certifications & Compliance
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {company.certifications.map((c) => (
                        <div key={c} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3">
                          <Award className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-foreground">{c}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
              <div className="space-y-5">
                {company.industries_served.length > 0 && (
                  <Card className="p-5">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Industries Served</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {company.industries_served.map((i) => (
                        <Link key={i} href={`/search?q=${encodeURIComponent(i)}&type=company`}>
                          <Badge variant="outline" className="cursor-pointer hover:border-primary/40 hover:bg-primary/5">{i}</Badge>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}
                {company.markets_served.length > 0 && (
                  <Card className="p-5">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Markets Served</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {company.markets_served.map((m) => (
                        <Badge key={m} variant="secondary">{m}</Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contact tab */}
          <TabsContent value="contact" className="mt-5">
            <Card id="contact" className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Contact {company.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Phone className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</span><span className="block text-sm font-medium text-foreground">{company.phone}</span></span>
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"><Mail className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</span><span className="block truncate text-sm font-medium text-foreground">{company.email}</span></span>
                  </a>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400"><Globe className="h-5 w-5" /></span>
                    <span className="min-w-0"><span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Website</span><span className="block truncate text-sm font-medium text-foreground">{company.website.replace(/^https?:\/\//, "")}</span></span>
                    <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                )}
                {company.business_hours && (
                  <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"><Clock className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Hours</span><span className="block text-sm font-medium text-foreground">{company.business_hours}</span></span>
                  </div>
                )}
              </div>
              {company.address && (
                <div className="mt-4 rounded-xl border border-border p-4">
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Address</h3>
                  <p className="text-sm font-medium text-foreground">{company.address}</p>
                  <p className="text-xs text-muted-foreground">{[company.district, company.city, company.state, company.country, company.postal_code].filter(Boolean).join(", ")}</p>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild>
                  <a href={`mailto:${company.email ?? ""}`}>
                    <Mail className="h-4 w-4" /> Send Inquiry
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={`/search?q=${encodeURIComponent(company.industry ?? company.name)}&type=company`}>
                    <FileText className="h-4 w-4" /> Find Similar Businesses
                  </Link>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related companies */}
        {related_companies.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">Related Companies</h2>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href={`/search?q=${encodeURIComponent(company.industry ?? company.category ?? "")}&type=company`}>
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {related_companies.map((rc) => {
                const rInitials = rc.name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
                return (
                  <Link
                    key={rc.id}
                    href={`/business/${rc.slug}`}
                    onClick={() => trackEvent("company_opened")}
                    className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                        {rInitials || <Building2 className="h-4 w-4" />}
                      </span>
                      {rc.verified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">{rc.name}</h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{rc.business_type}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{rc.city ?? "—"}</span>
                      {rc.rating > 0 && (
                        <span className="inline-flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {rc.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
