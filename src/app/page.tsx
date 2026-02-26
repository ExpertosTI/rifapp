import { Hero } from "@/components/home/Hero";
import { Amenities } from "@/components/home/Amenities";
import { TicketGenerator } from "@/components/raffle/TicketGenerator";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { Gallery } from "@/components/home/Gallery";
import { Countdown } from "@/components/home/Countdown";
import { SocialProof } from "@/components/home/SocialProof";
import { ProgressBar } from "@/components/home/ProgressBar";
import { WinnersGallery } from "@/components/home/WinnersGallery";
import { TrustSection } from "@/components/home/TrustSection";

import { getRaffleConfig } from "@/app/actions/config";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let config = null;
    try {
        config = await getRaffleConfig();
    } catch (e) {
        console.error("Failed to fetch raffle config:", e);
    }

    const safeConfig = config || {};

    return (
        <main className="flex min-h-screen flex-col bg-slate-950">
            {/* Social Proof Notifications */}
            <SocialProof />

            <Hero config={safeConfig} />

            {/* Countdown Timer - only show if drawDate is set */}
            {/* Countdown Timer */}
            <Countdown
                targetDate={
                    (safeConfig as any)?.drawDate
                        ? new Date((safeConfig as any).drawDate).toISOString()
                        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                }
                title="El sorteo será en"
            />

            {/* Progress Bar - Ticket Sales */}
            <div className="py-8">
                <ProgressBar soldTickets={247} totalTickets={1000} />
            </div>

            <div id="ticket-section">
                <TicketGenerator config={safeConfig} />
            </div>

            {/* Winners Gallery with Testimonials */}
            <WinnersGallery />

            <Gallery />

            <div id="amenities-section">
                <Amenities />
            </div>

            {/* Trust Section with FAQ */}
            <TrustSection />

            <TrustBadges />

            {/* Floating verify link */}
            <a
                href="/verify"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
                🔍 Verificar Ticket
            </a>
        </main>
    );
}
