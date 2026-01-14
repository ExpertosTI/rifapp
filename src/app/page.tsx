import { Hero } from "@/components/home/Hero";
import { Amenities } from "@/components/home/Amenities";
import { TicketGenerator } from "@/components/raffle/TicketGenerator";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { Gallery } from "@/components/home/Gallery";

import { getRaffleConfig } from "@/app/actions/config";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const config = await getRaffleConfig();

    return (
        <main className="flex min-h-screen flex-col bg-slate-950">
            <Hero config={config} />
            <div id="ticket-section">
                <TicketGenerator config={config} />
            </div>
            <Gallery />
            <div id="amenities-section">
                <Amenities />
            </div>
            <TrustBadges />
        </main>
    );
}
