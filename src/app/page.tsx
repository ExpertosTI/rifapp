import { Hero } from "@/components/home/Hero";
import { Amenities } from "@/components/home/Amenities";
import { TicketGenerator } from "@/components/raffle/TicketGenerator";
import { TicketChecker } from "@/components/raffle/TicketChecker";
import { Countdown } from "@/components/home/Countdown";
import { SocialProof } from "@/components/home/SocialProof";
import { ProgressBar } from "@/components/home/ProgressBar";
import { TrustSection } from "@/components/home/TrustSection";
import { WinnersGallery } from "@/components/home/WinnersGallery";

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
            <div className="py-6">
                <ProgressBar soldTickets={247} totalTickets={1000} />
            </div>

            <div id="ticket-section">
                <TicketGenerator config={safeConfig} />
            </div>

            <div id="verify-section">
                <TicketChecker />
            </div>

            <div id="winners-section">
                <WinnersGallery />
            </div>

            {/* Premios - Vehículos */}
            <div id="amenities-section">
                <Amenities />
            </div>

            {/* FAQ + Trust Badges */}
            <TrustSection />

        </main>
    );
}
