import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Up And Down The River Card Game",
    description:
        "A card scoring app for the game Up And Down The River. Makes it very easy to keep track of who's bidding what, how many tricks they won, and what is there total score. Supports multiple scoring options By Shimmie, 2024",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        //viewportFit: 'cover'
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "")}>
                <div className="flex justify-center m-5 p-3  h-full border-black border-2 rounded-md">
                    {children}
                </div>
            </body>
        </html>
    );
}
