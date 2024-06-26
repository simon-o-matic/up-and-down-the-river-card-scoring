"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Player, useGameState } from "./gameState";
import { useState } from "react";

export default function Home() {
    const router = useRouter();
    const gameState = useGameState();

    const [handsUpRiver, setHandsUpRiver] = useState("6");

    /** Check that number of hands is somewhat reasonable */
    const startNewGame = () => {
        const hands = Number(handsUpRiver);

        if (!isNaN(hands) && hands > 0 && hands < 52) {
            gameState.setHandsUpRiver(hands);

            router.push("/players");
        } else {
            alert(
                "Thats not a reasonable number of hands up the river to play. Try again."
            );
        }
    };

    return (
        <div className="flex flex-col h-full w-full justify-between align-middle  ">
            <div>
                <h4>Welcome to...</h4>
            </div>
            <div className=" h-36">
                <h1 className="text-3xl">Up And Down The River</h1>
                <h1 className="text-xl">Card Game Scoring App</h1>
            </div>
            <div className="grid grid-rows-2 grid-cols-1 items-center  ">
                <Label htmlFor="width">
                    How many hands up the river do you want?
                </Label>
                <div className="flex flex-row justify-between flex-nowrap ">
                    <Input
                        id="width"
                        defaultValue="6"
                        className="col-span-2 h-10 w-1/3 mr-3"
                        onChangeCapture={e => {
                            setHandsUpRiver(e.currentTarget.value);
                        }}
                    />
                    <Button
                        onClick={startNewGame}
                        className="h-10 w-2/3 hover:bg-sky-400 "
                    >
                        Start Game
                    </Button>
                </div>
            </div>
        </div>
    );
}
