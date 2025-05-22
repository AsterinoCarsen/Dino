'use client';

import Navbar from "./components/core/Navbar";
import { MantineProvider, Container, Button, Card } from "@mantine/core";
import { useRouter } from "next/navigation";

import '@mantine/core/styles.css';

export default function Main() {
    const router = useRouter();

    const handleGoRegister = () => {
        router.push("/register");
    }

    return (
        <MantineProvider>
            <Navbar />
            
            <section className="relative bg-white py-20 text-center shadow-md">
                <div className="absolute inset-0 bg-[url('/hero1.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
                <Container size="sm">
                    <h1>Welcome to Dino.</h1>
                    <p className="pb-15">Your personal climbing logbook with performance analytics, CR rating, and chart based insights.</p>
                    <Button onClick={handleGoRegister} size="lg" color="blue">
                        Log Your First Ascent
                    </Button>
                </Container>
            </section>

            <section className="py-20 bg-gray-50">
                <Container size="lg" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <h3>Track Your Growth</h3>
                        <p>Log every climb and monitor your progress over time with detailed stats and charts.</p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <h3>Data-Driven Insights</h3>
                        <p>Use analytics to understand your strengths and weaknesses for targeted training.</p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <h3>Personalized CR Rating</h3>
                        <p>Get a Climbing Rating (CR) that accurately reflects your skill level with an ELO-based system.</p>
                    </Card>
                </Container>
            </section>

            <section className="py-20 bg-white">
                <Container size="md" className="text-center">
                    <h2 className="pb-5">How it Works</h2>
                    <hr className="border-t pb-5 bordery-gray-300 max-w-xl mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <h3>1. Log Your Climbs</h3>
                            <p>Enter your ascents with details about routes, grades, and attempts.</p>
                        </div>

                        <div>
                            <h3>2. Analyze Your Performance</h3>
                            <p>View detailed charts showing progress, grade trends, and efficiency.</p>
                        </div>

                        <div>
                            <h3>3. Track Your CR Rating</h3>
                            <p>Watch your Climbing Rating evolve as you improve over time.</p>
                        </div>
                    </div>
                </Container>
            </section>
        </MantineProvider>
    )
}
