// A game in progress page
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGameState, Player } from "../gameState";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
export default function Bidding() {
    const gameState = useGameState();
    const router = useRouter();

    console.log("GAME STATE", gameState);
    /**
     * Index of the player who's edit box is active for the bidding. Needs to be
     * done in order and the last one has rules.
     */
    const [currentBidderPlayerIndex, setCurrentBidderPlayerIndex] =
        React.useState(-1);

    /** value of the current bid */
    const [dealerIndex, setDealerIndex] = React.useState(0);

    const upBid = () => {
        const currentBid =
            gameState.players[currentBidderPlayerIndex].roundScores[
                gameState.hand
            ].bid;

        gameState.changeBid(
            gameState.hand,
            currentBidderPlayerIndex,
            currentBid + 1
        );
    };

    const downBid = () => {
        const currentBid =
            gameState.players[currentBidderPlayerIndex].roundScores[
                gameState.hand
            ].bid;

        if (currentBid > 0) {
            gameState.changeBid(
                gameState.hand,
                currentBidderPlayerIndex,
                currentBid - 1
            );
        }
    };

    const submitBid = (isFinal: boolean = false) => {
        // // can't submit for its set. Shouldn't even happen, but whatever.
        // console.log("submitting bid for ", currentBidderPlayerIndex);
        // if (currentBidderPlayerIndex === -1) return;

        // move to the next player to bid
        setCurrentBidderPlayerIndex(
            (currentBidderPlayerIndex + 1) % gameState.players.length
        );

        if (isFinal) {
            alert("Play The Hand Now");
            router.push("/wins");
        }
    };

    // TODO: which bid are we not allowed?

    /**
     * Work out at the start who the dealer is for this round. Because
     * the next person is the first bidder.
     */
    useEffect(() => {
        // only do this first time in.
        if (currentBidderPlayerIndex !== -1) return;

        cardsThisHand =
            gameState.hand + 1 > gameState.handsUpRiver
                ? gameState.handsUpRiver -
                  (gameState.hand + 1 - gameState.handsUpRiver)
                : gameState.hand + 1;

        console.log("Cards this hand?", cardsThisHand);

        // dealer for this hand depends on the hand number.
        const dealerIndex = gameState.hand % gameState.players.length;
        setDealerIndex(dealerIndex);

        // The first bidder is one after the dealer
        setCurrentBidderPlayerIndex(
            (dealerIndex + 1) % gameState.players.length
        );
        console.log("Dealer is...", dealerIndex);
    }, [
        gameState.hand,
        gameState.players.length,
        currentBidderPlayerIndex,
        gameState.handsUpRiver,
    ]);

    if (gameState.handsUpRiver === 0) {
        // game reset, go back to the start
        router.push("/");
        return;
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex w-full justify-between text-2xl mb-3 ">
                <div>Hand: {gameState.hand + 1} </div>
                <div>Cards To Deal: {cardsThisHand}</div>
            </div>
            <div className="flex w-full justify-center text-4xl mb-3">
                Enter Player Bids
            </div>

            <div className="flex flex-wrap w-full  justify-center">
                {gameState.players.map((player, playerIndex) => (
                    <Card
                        key={player.id}
                        className={`w-min-[390px] [w-max-[400px] ${
                            playerIndex === currentBidderPlayerIndex
                                ? "border-blue-700 border-4"
                                : "border-slate-900 border-2"
                        }  m-2`}
                    >
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {player.name}{" "}
                                {playerIndex === dealerIndex ? "(dealer)" : ""}
                            </CardTitle>
                            <CardDescription>
                                How many hands does this player think they can
                                win?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-row  w-full  justify-between">
                                <div className="flex flex-col w-1/2 border-2 rounded-lg  justify-center text-6xl ">
                                    {
                                        gameState.players[playerIndex]
                                            .roundScores[gameState.hand].bid
                                    }
                                </div>

                                <div className="flex w-1/3 flex-col ">
                                    <Button
                                        onClick={
                                            playerIndex ==
                                            currentBidderPlayerIndex
                                                ? upBid
                                                : undefined
                                        }
                                        className={`h-12 mb-1 border ${
                                            playerIndex ===
                                            currentBidderPlayerIndex
                                                ? "bg-blue-400"
                                                : "bg-gray-300"
                                        }`}
                                    >
                                        up
                                    </Button>
                                    <Button
                                        onClick={
                                            playerIndex ==
                                            currentBidderPlayerIndex
                                                ? downBid
                                                : undefined
                                        }
                                        className={`h-12 mt-1 border ${
                                            playerIndex ===
                                            currentBidderPlayerIndex
                                                ? "bg-blue-400"
                                                : "bg-gray-300"
                                        }`}
                                    >
                                        down
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-right">
                            {playerIndex == currentBidderPlayerIndex ? (
                                <Button
                                    onClick={() =>
                                        submitBid(playerIndex === dealerIndex)
                                    }
                                >
                                    {playerIndex === dealerIndex ? (
                                        <div className="font-bold text-blue-700">
                                            Submit Final Bid
                                        </div>
                                    ) : (
                                        "Submit Bid"
                                    )}
                                </Button>
                            ) : (
                                <Button className="italic">Wait turn</Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
