// A game in progress page
"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useGameState } from "../gameState";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

/**
 * The bidding phase must be compled in order, and the last bidder has restrictions.
 * The last bidder is always the dealer! How convenient.
 *
 * Actions:
 *      up a bid
 *      down a bid
 */
export default function Winning() {
    const gameState = useGameState();
    const router = useRouter();

    const isLastHand = () =>
        gameState.hand + 1 === gameState.handsUpRiver * 2 - 1;

    const nextHand = () => {
        if (isLastHand()) {
            router.replace("/gameover");
        } else {
            gameState.nextHand();
            router.replace("/bid");
        }
    };

    const cardsThisHand =
        gameState.hand + 1 > gameState.handsUpRiver
            ? gameState.handsUpRiver -
              (gameState.hand + 1 - gameState.handsUpRiver)
            : gameState.hand + 1;

    const upWon = (playerIndex: number) => {
        const won =
            gameState.players[playerIndex].roundScores[gameState.hand].won;
        if (won === cardsThisHand) return;

        gameState.changeWon(gameState.hand, playerIndex, won + 1);
    };

    const downWon = (playerIndex: number) => {
        const won =
            gameState.players[playerIndex].roundScores[gameState.hand].won;
        if (won === 0) return;

        gameState.changeWon(gameState.hand, playerIndex, won - 1);
    };

    const calculatePlayerTotalScoreSoFar = (playerIndex: number) => {
        let total = 0;

        for (let h = 0; h <= gameState.hand; h++) {
            const playerBidWon = gameState.players[playerIndex].roundScores[h];

            if (playerBidWon.bid === playerBidWon.won) {
                if (playerBidWon.bid === 0) {
                    total += gameState.config.pointsForCorrectZeroBid;
                } else {
                    total += gameState.config.pointsForCorrectNonZeroBid;
                }
            }

            total += playerBidWon.won;
        }

        return total;
    };

    // game reset, go back to the start
    if (gameState.handsUpRiver === 0) {
        router.replace("/");
        return;
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex w-full justify-between text-2xl mb-3 ">
                <div>
                    Hand: {gameState.hand + 1} /{" "}
                    {gameState.handsUpRiver * 2 - 1}
                </div>
                <div>Cards Dealt: {cardsThisHand}</div>
            </div>
            <div className="flex w-full justify-center text-4xl mb-3">
                Enter Tricks Won
            </div>

            <div className="flex flex-wrap w-full  justify-center">
                {gameState.players.map((player, playerIndex) => (
                    <Card
                        key={player.id}
                        className={`w-min-[390px] [w-max-[400px] border-slate-900 border-2 m-2`}
                    >
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {player.name}
                            </CardTitle>
                            <CardDescription className="">
                                How many tricks did this player win? They bid{" "}
                                {player.roundScores[gameState.hand].bid}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-row  w-full  justify-between">
                                <div className="flex flex-col w-1/2 border-2 rounded-lg  justify-center text-6xl ">
                                    {
                                        gameState.players[playerIndex]
                                            .roundScores[gameState.hand].won
                                    }
                                </div>

                                <div className="flex w-1/3 flex-col ">
                                    <Button
                                        onClick={() => upWon(playerIndex)}
                                        className={`h-12 mb-1 border bg-gray-300}`}
                                    >
                                        up
                                    </Button>
                                    <Button
                                        onClick={() => downWon(playerIndex)}
                                        className={`h-12 mt-1 border bg-gray-300}`}
                                    >
                                        down
                                    </Button>
                                </div>
                            </div>
                            <div>
                                TOTAL SCORE:{" "}
                                {calculatePlayerTotalScoreSoFar(playerIndex)}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-right"></CardFooter>
                    </Card>
                ))}
            </div>

            <Button onClick={nextHand} className="max-w-64">
                {isLastHand() ? "View Final Scores" : "Start Next Hand"}
            </Button>
        </div>
    );
}