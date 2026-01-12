import { Hero } from "@/components/home/Hero";
import { Amenities } from "@/components/home/Amenities";
import { TicketGenerator } from "@/components/raffle/TicketGenerator";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { Gallery } from "@/components/home/Gallery";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-slate-950">
            <Hero />
            <div id="ticket-section">
                <TicketGenerator />
            </div>
            <Gallery />
            <div id="amenities-section">
                <Amenities />
            </div>
            <TrustBadges />
        </main>
    );
}
