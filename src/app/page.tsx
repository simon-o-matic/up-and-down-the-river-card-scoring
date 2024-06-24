"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
    const router = useRouter();

    /** No need to do anything else here */
    const startNewGame = () => {
        router.push("/players");
    };

    return (
        <div className="flex h-96 w-1/2 p-4 justify-between align-middle  flex-col bg-red-400">
            <div>
                <h4>Welcome to...</h4>
            </div>
            <div>
                <h1 className="text-3xl">
                    Up And Down The River Card Game Scoring System
                </h1>
            </div>
            <Button
                onClick={startNewGame}
                className=" flex w-52 clear-right h-12 text-lg hover:bg-sky-400 cursor-pointer items-center justify-center rounded border red"
            >
                START NEW GAME
            </Button>
        </div>
    );
}
