'use client';

import Navbar from "./components/core/Navbar";
import { MantineProvider } from "@mantine/core";

import '@mantine/core/styles.css';

export default function Main() {
    return (
        <MantineProvider>
            <Navbar />
        </MantineProvider>
    )
}
