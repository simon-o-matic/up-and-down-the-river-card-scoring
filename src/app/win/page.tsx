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
import { calculatePlayerTotalScoreSoFar } from "@/lib/utils";

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

    const calculateTricksWon = () =>
        gameState.players.reduce(
            (acc, p) => acc + p.roundScores[gameState.hand].won,
            0
        );

    const nextHand = () => {
        // check for correct number of tricks won
        if (calculateTricksWon() !== gameState.hand + 1) {
            alert("The number of tricks won doesn't add up!");
            return;
        }

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
                        className={` w-[400px] border-slate-900 border-2 m-2`}
                    >
                        <CardHeader>
                            <CardTitle className="flex w-full justify-between text-lg">
                                <div>{player.name} </div>
                                <div>
                                    score:{" "}
                                    {calculatePlayerTotalScoreSoFar(
                                        playerIndex,
                                        gameState,
                                        true
                                    )}
                                </div>
                            </CardTitle>
                            <CardDescription className="">
                                How many tricks did this player win?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-row  w-full  justify-center">
                                <div className="text-gray-400">
                                    <div>bid</div>
                                    <div
                                        className={`flex align-baseline justify-center text-6xl mr-2`}
                                    >
                                        {
                                            gameState.players[playerIndex]
                                                .roundScores[gameState.hand].bid
                                        }
                                    </div>
                                </div>
                                won
                                <div className="flex flex-col justify-center text-8xl ">
                                    {
                                        gameState.players[playerIndex]
                                            .roundScores[gameState.hand].won
                                    }
                                </div>
                                <div className="flex flex-col justify-around ml-2">
                                    <Button
                                        className="mb-1 border bg-blue-400"
                                        onClick={() => upWon(playerIndex)}
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        onClick={() => downWon(playerIndex)}
                                        className={`mt-1 border bg-blue-400`}
                                    >
                                        ↓
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-right"></CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex flex-wrap w-full  justify-center">
                <Button
                    onClick={nextHand}
                    className="max-w-64 bg-blue-400 my-3 just"
                >
                    {isLastHand() ? "View Final Scores" : "Start Next Hand"}
                </Button>
            </div>
        </div>
    );
}
