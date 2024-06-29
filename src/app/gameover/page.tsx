// A game in progress page
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGameState, Player } from "../gameState";
import { Button } from "@/components/ui/button";
import { calculatePlayerTotalScoreSoFar, toPosition } from "@/lib/utils";

/** how many cards are dealt this hand - calculated once */
let cardsThisHand = 0;

/**
 * The bidding phase must be compled in order, and the last bidder has restrictions.
 * The last bidder is always the dealer! How convenient.
 *
 * Actions:
 *      up a bid
 *      down a bid
 */
export default function GameOver() {
    const gameState = useGameState();
    const router = useRouter();

    if (gameState.stage === "pre-game") {
        router.replace("/");
        return;
    }

    return (
        <div className="flex flex-col w-full h-full justify-between ">
            <div className="flex-1">
                <div className="flex w-full justify-between text-2xl mb-3 ">
                    <div>Hands played: {gameState.hand + 1} </div>
                    <div>Game Over</div>
                </div>
                <div className="flex w-full justify-center text-4xl mb-4">
                    Final Standings
                </div>

                <div className="flex flex-col w-full ">
                    {gameState.players
                        .toSorted(
                            (a, b) =>
                                calculatePlayerTotalScoreSoFar(
                                    gameState.players.findIndex(
                                        p => p.id === b.id
                                    ),
                                    gameState
                                ) -
                                calculatePlayerTotalScoreSoFar(
                                    gameState.players.findIndex(
                                        p => p.id == a.id
                                    ),
                                    gameState
                                )
                        )
                        .map((player, i) => (
                            <div
                                key={player.id}
                                className="flex flex-row justify-between w-min-[390px] [w-max-[400px] border-2 rounded-lg p-2 border-blue-950 mb-2 text-3xl"
                            >
                                <div>
                                    {i + 1}
                                    <sup className="mr-4">
                                        {toPosition(i + 1)}
                                    </sup>
                                    {player.name}
                                </div>
                                <div>
                                    {calculatePlayerTotalScoreSoFar(
                                        gameState.players.findIndex(
                                            p => p.id === player.id
                                        ),
                                        gameState
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <Button onClick={() => router.replace("/")}>Play Again?</Button>
        </div>
    );
}
