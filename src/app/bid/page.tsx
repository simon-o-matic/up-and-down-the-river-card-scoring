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
import { calculatePlayerTotalScoreSoFar } from "@/lib/utils";

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

    /**
     * Index of the player who's edit box is active for the bidding. Needs to be
     * done in order and the last one has rules.
     */
    const [currentBidderPlayerIndex, setCurrentBidderPlayerIndex] =
        React.useState(-1);

    /** sum of all bids. Used to limit dealers bid options */
    //const [totalBids, setTotalBids] = React.useState(0);

    /** player who is dealer */
    const [dealerIndex, setDealerIndex] = React.useState(0);

    // helper to limit what the dealer can bid
    const totalBidValue = gameState.players.reduce(
        (acc, p, i) =>
            acc + (i === dealerIndex ? 0 : p.roundScores[gameState.hand].bid),
        0
    );

    const dealerCantBidValue =
        gameState.hand + 1 - totalBidValue >= 0
            ? gameState.hand + 1 - totalBidValue
            : -1;

    const upBid = () => {
        const currentBid =
            gameState.players[currentBidderPlayerIndex].roundScores[
                gameState.hand
            ].bid;

        if (currentBid === gameState.hand + 1) {
            return;
        }

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
        // validate the bid
        if (isFinal) {
            const currentBid =
                gameState.players[currentBidderPlayerIndex].roundScores[
                    gameState.hand
                ].bid;
            if (currentBid === dealerCantBidValue) return;
        }

        // move to the next player to bid
        setCurrentBidderPlayerIndex(
            (currentBidderPlayerIndex + 1) % gameState.players.length
        );

        if (isFinal) {
            router.replace("/win");
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

        // dealer for this hand depends on the hand number.
        const dealerIndex = gameState.hand % gameState.players.length;
        setDealerIndex(dealerIndex);

        // The first bidder is one after the dealer
        setCurrentBidderPlayerIndex(
            (dealerIndex + 1) % gameState.players.length
        );
    }, [
        gameState.hand,
        gameState.players.length,
        currentBidderPlayerIndex,
        gameState.handsUpRiver,
    ]);

    if (gameState.handsUpRiver === 0) {
        // game reset, go back to the start
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
                <div>Cards To Deal: {cardsThisHand}</div>
            </div>
            <div className="flex w-full justify-center text-4xl mb-3">
                Enter Player Bids
            </div>

            <div className="flex flex-wrap w-full justify-center">
                {gameState.players.map((player, playerIndex) => (
                    <Card
                        key={player.id}
                        className={`w-[390px]  ${
                            playerIndex === currentBidderPlayerIndex
                                ? "border-blue-700 border-4"
                                : "border-slate-900 border-2"
                        }  m-2`}
                    >
                        <CardHeader>
                            <CardTitle className="flex w-full justify-between text-lg">
                                <div>
                                    {player.name}{" "}
                                    {playerIndex === dealerIndex
                                        ? "(dealer)"
                                        : ""}
                                </div>
                                <div>
                                    score:{" "}
                                    {calculatePlayerTotalScoreSoFar(
                                        playerIndex,
                                        gameState,
                                        false
                                    )}
                                </div>
                            </CardTitle>
                            <CardDescription className="w-50">
                                How many tricks does this player think they can
                                win?{" "}
                                {playerIndex === dealerIndex &&
                                playerIndex === currentBidderPlayerIndex
                                    ? dealerCantBidValue < 0
                                        ? "Any bid is fine."
                                        : "Can't bid " + dealerCantBidValue
                                    : ""}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-row  w-full justify-center">
                                bid
                                <div
                                    className={`flex align-baseline justify-center text-8xl mr-2 ${
                                        dealerCantBidValue ===
                                        gameState.players[playerIndex]
                                            .roundScores[gameState.hand].bid
                                            ? "text-gray-400"
                                            : ""
                                    }`}
                                >
                                    {
                                        gameState.players[playerIndex]
                                            .roundScores[gameState.hand].bid
                                    }
                                </div>
                                <div className="flex flex-col justify-around ml-2">
                                    <Button
                                        onClick={
                                            playerIndex ==
                                            currentBidderPlayerIndex
                                                ? upBid
                                                : undefined
                                        }
                                        className={`mb-1 border ${
                                            playerIndex ===
                                            currentBidderPlayerIndex
                                                ? "bg-blue-400"
                                                : "bg-gray-300"
                                        }`}
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        onClick={
                                            playerIndex ==
                                            currentBidderPlayerIndex
                                                ? downBid
                                                : undefined
                                        }
                                        className={`mt-1 border ${
                                            playerIndex ===
                                            currentBidderPlayerIndex
                                                ? "bg-blue-400"
                                                : "bg-gray-300"
                                        }`}
                                    >
                                        ↓
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex w-full justify-center ">
                            {playerIndex == currentBidderPlayerIndex ? (
                                <Button
                                    className={`w-40 ${
                                        playerIndex === currentBidderPlayerIndex
                                            ? "bg-blue-400"
                                            : "bg-gray-300"
                                    } ${
                                        playerIndex === dealerIndex
                                            ? "bg-red-600"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        submitBid(playerIndex === dealerIndex)
                                    }
                                >
                                    {playerIndex === dealerIndex ? (
                                        <div className="font-bold text-white ">
                                            Submit Final Bid
                                        </div>
                                    ) : (
                                        "Submit Bid"
                                    )}
                                </Button>
                            ) : (
                                <Button className="w-40 bg-gray-300 italic">
                                    Wait
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
