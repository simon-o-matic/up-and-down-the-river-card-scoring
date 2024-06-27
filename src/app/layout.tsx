import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Up And Down The River",
    description: "By Shimmie",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "flex justify-center ")}>
                <div className="m-5 p-3 w-full h-full border-black border-2 rounded-md">
                    {children}
                </div>
            </body>
        </html>
    );
}
