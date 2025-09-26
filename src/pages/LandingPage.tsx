import type { ReactNode, ComponentProps } from "react";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, ShoppingCart, ArrowRight, Check, Quote, Play, Save, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {cn} from "@/lib/utils";

// ---------------------- Content Data ----------------------
const highlights = [
    { icon: <Sparkles className="w-5 h-5" />, title: "Smart Fill", desc: "Drag, drop, and let AI build a balanced week in seconds." },
    { icon: <ShoppingCart className="w-5 h-5" />, title: "Auto-grouped groceries", desc: "Shop faster with lists sorted by supermarket aisles." },
    { icon: <Save className="w-5 h-5" />, title: "Save & share", desc: "Save menus and recipes or share them to collect hearts and comments." },
];

const steps = [
    { num: 1, title: "Pick your week & buckets", desc: "Add breakfasts and lunch/dinner items to two simple lists." },
    { num: 2, title: "Smart fill or customize", desc: "Let AI suggest recipes or drag in your favorites to complete the week." },
    { num: 3, title: "Share & get feedback", desc: "Publish your menu, collect hearts and comments, and inspire others." },
];

const reviews = [
    { text: "We plan once a week and share the menu in our chat - everyone votes with hearts!", author: "Alex P.", role: "Busy parent" },
    { text: "The grocery list groups by aisle. In and out in 20 minutes.", author: "Maya R.", role: "Graduate student" },
    { text: "Recommendations are spot-on for our style.", author: "Jon K.", role: "Foodie" },
];

type Plan = {
    name: string;
    price: string;
    period: string;
    badge?: string;
    features: string[];
};

type PricingCardProps = { plan: Plan };

const pricing: Plan[] = [
    { name: "Free", price: "€0", period: "/mo", badge: "No credit card", features: [
            "Weekly planning (Breakfasts + Lunch/Dinner)",
            "Aisle‑optimized grocery list",
            "Share menus & recipes",
            "Likes & feedback",
        ] },
    { name: "Pro", price: "€9", period: "/mo", badge: "Popular", features: [
            "Smart recommendations",
            "Prep mode + timers",
            "Advanced filters & bulk actions",
            "Priority support",
        ] },
];

// ---------------------- Small UI atoms ----------------------
type PrimaryCTAProps = ComponentProps<typeof Button> & { children: ReactNode };

const PrimaryCTA = ({ className, children, ...props }: PrimaryCTAProps) => (
    <Button
        className={cn(
            "rounded-lg bg-[#0B1529] hover:bg-[#0B1529]/90 text-white shadow-[0_2px_0_#0000000f,0_10px_30px_-10px_rgba(11,21,41,0.6)] px-5 h-12 text-base font-semibold inline-flex items-center gap-2",
            className
        )}
        {...props}
    >
        {children}
    </Button>
);

type SecondaryCTAProps = ComponentProps<typeof Button> & { children: ReactNode };

const SecondaryCTA = ({ className, children, ...props }: SecondaryCTAProps) => (
    <Button
        variant="outline"
        className={cn(
            "rounded-lg bg-white hover:bg-white shadow-[0_1px_0_#0000000a,0_8px_24px_-10px_rgba(2,6,23,0.15)] border border-neutral-200 px-5 h-12 text-base font-semibold inline-flex items-center gap-2",
            className
        )}
        {...props}
    >
        {children}
    </Button>
);

function LovedBy() {
    return (
        <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 inline-block" />
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 inline-block" />
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 inline-block" />
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 inline-block" />
            </div>
            <span>Loved by 5,000+ home cooks</span>
        </div>
    );
}

function LabelChip() {
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-neutral-700 text-xs border border-neutral-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Your week, on autopilot
        </div>
    );
}

// ---------------------- Layout Sections ----------------------
function Nav() {
    return (
        <div className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
            <Container className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center"><ChefHat className="w-5 h-5"/></div>
                    <span className="font-semibold tracking-tight">MyMealPrep</span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
                    <a href="#features" className="hover:text-neutral-900">Features</a>
                    <a href="#how" className="hover:text-neutral-900">How it works</a>
                    <a href="#pricing" className="hover:text-neutral-900">Pricing</a>
                    <a href="#faq" className="hover:text-neutral-900">FAQ</a>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="rounded-lg h-10 px-3">Sign in</Button>
                    <Button className="rounded-lg h-10 px-4 bg-[#0B1529] hover:bg-[#0B1529]/90 text-white shadow-[0_2px_0_#0000000f,0_10px_30px_-10px_rgba(11,21,41,0.6)]">Get started</Button>
                </div>
            </Container>
        </div>
    );
}

function WeekPreview() {
    const recos = [
        { title: "Overnight oats", tag: "Breakfast" },
        { title: "Chicken burrito bowl", tag: "Lunch/Dinner" },
        { title: "Veggie stir‑fry", tag: "Lunch/Dinner" },
    ];
    return (
        <div className="rounded-3xl border border-neutral-200 shadow-sm p-6 bg-white">
            {/* Top row: align both headers on the same level */}
            <div className="grid md:grid-cols-2 gap-6 items-start mb-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Your weekly plan</div>
                <div className="">
                    <div className="text-sm font-medium">Recommendations for this week</div>
                    <div className="text-xs text-neutral-500">Based on your likes & history</div>
                </div>
            </div>

            {/* Content row: single panel with two inner columns, no extra borders */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left: buckets copy */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">Breakfasts</div>
                        </div>
                        <div className="text-sm text-neutral-500">Drag, drop, and you're done.</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">Lunch + Dinner</div>
                        </div>
                        <div className="text-sm text-neutral-500">Fill the bucket with your favorite recipes.</div>
                    </div>
                </div>

                {/* Right: three recommendations (visual only; buttons disabled) */}
                <div>
                    <ul className="mt-0 space-y-3">
                        {recos.map((r) => (
                            <li key={r.title} className="rounded-xl border border-neutral-200 p-3 flex items-center justify-between bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-neutral-400" />
                                    <div>
                                        <div className="text-sm font-medium">{r.title}</div>
                                        <div className="text-xs text-neutral-500">{r.tag}</div>
                                    </div>
                                </div>
                                <Button
                                    data-reco-title={r.title}
                                    size="sm"
                                    variant="outline"
                                    className="rounded-lg h-8 px-3 pointer-events-none opacity-60"
                                    disabled
                                >
                                    Add
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom CTA (visual only; disabled) */}
            <div className="mt-6 pointer-events-none" data-preview-cta>
                <div className="flex gap-3">
                    <Button className="rounded-lg h-10 px-4 bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-sm" disabled>
                        Generate grocery list
                    </Button>
                    <Button
                        data-week-smartfill
                        variant="outline"
                        className="rounded-lg h-10 px-4 bg-white text-neutral-700 border border-neutral-200 shadow-sm inline-flex items-center gap-2"
                        disabled
                    >
                        <Sparkles className="w-4 h-4" /> Smart fill
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Hero() {
    return (
        <Section background="gradient" padding="xl">
            <Container className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <LabelChip />
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6 max-w-[18ch] text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                        Plan a delicious week in minutes
                    </motion.h1>
                    <p className="mt-5 max-w-prose text-neutral-600">Two simple buckets—Breakfasts and Lunch/Dinner. Auto‑create groceries, save, share, and collect feedback without the clutter.</p>
                    <div className="mt-8 flex gap-4">
                        <PrimaryCTA>Start free <ArrowRight className="w-4 h-4"/></PrimaryCTA>
                        <SecondaryCTA>Watch 60s demo <Play className="w-4 h-4"/></SecondaryCTA>
                    </div>
                    <LovedBy />
                </div>
                <WeekPreview />
            </Container>
        </Section>
    );
}

function SectionHeader(
    { title, subtitle, center = true }: { title: string; subtitle?: string; center?: boolean }
) {
    return (
        <div className={cn(center && "text-center", "mb-12")}>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
            {subtitle ? <p className="text-neutral-600 mt-2">{subtitle}</p> : null}
        </div>
    );
}

function Features() {
    return (
        <Section id="features" background="neutral-50" padding="xl">
            <Container>
                <SectionHeader title="Everything you need to own the week" subtitle="Plan your week, shop with ease, and share the tasty results." />
                <div className="grid md:grid-cols-3 gap-6">
                    {highlights.map((h) => (
                        <Card key={h.title} className="rounded-2xl hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="h-8 w-8 rounded-xl bg-neutral-200 text-black flex items-center justify-center">{h.icon}</div>
                                <CardTitle className="text-base">{h.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-neutral-600 -mt-2">{h.desc}</CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

function HowItWorks() {
    return (
        <Section id="how" background="white" padding="xl">
            <Container>
                <SectionHeader title="How it works" subtitle="Three simple steps to stress-free meal prep" />
                <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((s) => (
                        <Card key={s.num} className="rounded-2xl text-center">
                            <CardHeader className="pb-2 flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">{s.num}</div>
                                <CardTitle className="mt-3 text-lg font-medium">{s.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-neutral-600">{s.desc}</CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

function Demo() {
    return (
        <Section background="neutral-50" padding="xl">
            <Container className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight">See MyMealPrep in action</h2>
                    <p className="text-neutral-500 mt-3 text-lg">This 60‑second tour shows planning, automatic grocery lists, and prep mode. No signup required.</p>
                    <div className="mt-6 flex gap-3">
                        <PrimaryCTA>Try free <ArrowRight className="w-4 h-4"/></PrimaryCTA>
                        <SecondaryCTA>Watch demo <Play className="w-4 h-4" /></SecondaryCTA>
                    </div>
                </div>
                <div className="rounded-3xl bg-neutral-900 text-white aspect-video flex items-center justify-center shadow-lg">
                    <div className="flex items-center gap-3 text-lg">
                        <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-neutral-900"><Play className="w-4 h-4"/></span>
                        <span className="opacity-90">Demo preview</span>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function PricingCard({ plan }: PricingCardProps) {
    const isPro = plan.name === "Pro";
    return (
        <div className={`rounded-[24px] p-6 md:p-8 border relative overflow-hidden ${isPro ? 'bg-gradient-to-br from-slate-50 to-slate-100' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">{plan.name}</div>
                {plan.badge && (
                    <div className={`text-xs px-3 py-1 rounded-full ${isPro ? 'bg-[#0B1529] text-white' : 'bg-white border shadow-sm text-slate-700'}`}>{plan.badge}</div>
                )}
            </div>
            <div className="mt-4 text-4xl font-bold">{plan.price}<span className="text-lg font-normal text-neutral-500">{plan.period}</span></div>
            <ul className="mt-6 space-y-3 text-[15px] text-slate-700">
                {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded-full border flex items-center justify-center"><Check className="w-3.5 h-3.5"/></span>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                <Button className={`w-full h-12 rounded-lg font-semibold ${isPro ? 'bg-[#0B1529] text-white hover:bg-[#0B1529]/90' : 'bg-[#0B1529] text-white hover:bg-[#0B1529]/90'}`}>{isPro ? 'Go Pro' : 'Get started'}</Button>
            </div>
        </div>
    );
}

function Pricing() {
    return (
        <Section id="pricing" background="white" padding="xl">
            <Container>
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Simple pricing</h2>
                    <p className="text-neutral-600 mt-2 text-lg">Start free. Upgrade anytime for power features.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {pricing.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

function Reviews() {
    return (
        <Section background="neutral-50" padding="xl">
            <Container className="grid md:grid-cols-3 gap-6">
                {reviews.map((r, i) => (
                    <Card key={i} className="rounded-2xl bg-white/90 backdrop-blur">
                        <CardContent className="p-6 text-center flex flex-col items-center gap-4">
                            <Quote className="w-6 h-6 text-rose-400" />
                            <p className="text-neutral-800 italic">"{r.text}"</p>
                            <div className="text-sm font-medium text-black">{r.author}</div>
                            <div className="text-xs text-neutral-500">{r.role}</div>
                        </CardContent>
                    </Card>
                ))}
            </Container>
        </Section>
    );
}

function FAQ() {
    return (
        <Section id="faq" background="neutral-100" padding="xl">
            <Container className="max-w-[960px]">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Frequently asked questions</h2>
                    <p className="text-neutral-600 mt-2">Everything you're wondering, answered.</p>
                </div>
                <div className="divide-y divide-slate-200 bg-white rounded-2xl shadow-sm">
                    {[
                        { q: 'Is there a free plan?', a: 'Yes, the Free plan includes weekly planning, Smart Fill (limited), grocery lists, and more.' },
                        { q: 'Can I import my own recipes?', a: 'Absolutely. Add your recipes with ingredients, steps, tags, and store them in your library.' },
                        { q: 'Can I share menus with friends?', a: 'Yes, make a menu public and share the link. Friends can leave hearts and comments.' },
                        { q: 'Is MyMealPrep available on mobile?', a: 'Yes, it works great on mobile browsers and a native app is on the roadmap.' },
                    ].map((item, idx) => (
                        <details key={idx} className="group p-5">
                            <summary className="cursor-pointer list-none flex items-center justify-between text-lg font-medium">
                                <span>{item.q}</span>
                                <span className="text-slate-400 transition-transform group-open:rotate-90">▸</span>
                            </summary>
                            <p className="mt-2 text-slate-600">{item.a}</p>
                        </details>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

function Footer() {
    return (
        <footer className="w-full border-t py-10 bg-white">
            <Container className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center"><ChefHat className="w-5 h-5"/></div>
                    <span className="font-semibold tracking-tight">MyMealPrep</span>
                </div>
                <nav className="flex items-center gap-8 text-slate-500 text-sm">
                    <a className="hover:text-slate-900" href="#">Privacy</a>
                    <a className="hover:text-slate-900" href="#">Terms</a>
                    <a className="hover:text-slate-900" href="#">Contact</a>
                    <a className="hover:text-slate-900" href="#">Sign in</a>
                </nav>
            </Container>
        </footer>
    );
}

export default function PublicLanding() {
    return (
        <div className="min-h-screen w-full bg-white text-neutral-900">
            <Nav />
            <Hero />
            <Features />
            <HowItWorks />
            <Demo />
            <Pricing />
            <Reviews />
            <FAQ />
            <Footer />
        </div>
    );
}