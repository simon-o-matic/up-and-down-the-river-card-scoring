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

/**
 * The bidding phase must be compled in order, and the last bidder has restrictions.
 *
 * Actions:
 *      up a bid
 *      down a bid
 */
export default function Bidding() {
    const gameState = useGameState();
    const router = useRouter();

    const changeBid = useGameState().changeBid;

    /**
     * Index of the player who's edit box is active for the bidding. Needs to be
     * done in order and the last one has rules.
     */
    const [currentBidderPlayerIndex, setCurrentBidderPlayerIndex] =
        React.useState(-1);

    /** value of the current bid */
    const [dealerIndex, setDealerIndex] = React.useState(0);

    const upBid = () => {
        console.log(
            "Round scores upbid: ",
            gameState.players[currentBidderPlayerIndex].roundScores
        );

        const currentBid =
            gameState.players[currentBidderPlayerIndex].roundScores[
                gameState.hand
            ].bid;

        console.log("About to upbid: ", currentBid);
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

        console.log("About to downBid: ", currentBid);
        if (currentBid > 0) {
            gameState.changeBid(
                gameState.hand,
                currentBidderPlayerIndex,
                currentBid - 1
            );
        }
    };

    const submitBid = () => {
        // can't submit for its set. Shouldn't even happen, but whatever.
        console.log("submitting bid for ", currentBidderPlayerIndex);
        if (currentBidderPlayerIndex === -1) return;

        // move to the next player to bid
        setCurrentBidderPlayerIndex(
            (currentBidderPlayerIndex + 1) % gameState.players.length
        );
    };

    // TODO: which bid are we not allowed?
    /**
     * Work out at the start who the dealer is for this round. Because
     * the next person is the first bidder.
     */
    useEffect(() => {
        // only do this first time in.
        if (currentBidderPlayerIndex !== -1) return;

        console.log("Setting initial dealer and first bidder");

        // dealer for this hand depends on the hand number.
        const dealerIndex = gameState.hand % gameState.players.length;
        setDealerIndex(dealerIndex);

        // The first bidder is one after the dealer
        setCurrentBidderPlayerIndex(
            (dealerIndex + 1) % gameState.players.length
        );
        console.log("Dealer is...", dealerIndex);
    }, [gameState.hand, gameState.players.length, currentBidderPlayerIndex]);

    return (
        <div className="flex flex-col bg-red-400">
            <div className="text-3xl">
                Round {gameState.hand}. Cards To Deal: {4}.
            </div>
            <div className="text-2xl">Enter player bids</div>

            <div className="flex flex-wrap">
                {gameState.players.map((player, playerIndex) => (
                    <Card
                        key={player.id}
                        className="w-[250px]  ml-2 mr-2 bg-purple-300"
                    >
                        <CardHeader>
                            <CardTitle>{player.name}</CardTitle>
                            <CardDescription>
                                How many hands does this player think they can
                                win?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-row  w-full bg-purple-400 justify-evenly">
                                <div className="flex flex-col w-1/2 border-2 rounded align-bottom justify-center text-6xl bg-red-600">
                                    {gameState.players[playerIndex].roundScores[
                                        gameState.hand
                                    ] !== undefined
                                        ? gameState.players[playerIndex]
                                              .roundScores[gameState.hand].bid
                                        : 0}
                                </div>

                                <div className="flex w-1/3 flex-col  bg-yellow-500">
                                    <Button
                                        onClick={
                                            playerIndex ==
                                            currentBidderPlayerIndex
                                                ? upBid
                                                : undefined
                                        }
                                        className="bg-gray-400 h-12 mb-1 border"
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
                                        className="bg-gray-400 h-12 mt-1 border"
                                    >
                                        dn
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        {playerIndex == currentBidderPlayerIndex ? (
                            <CardFooter className="flex justify-between">
                                <Button onClick={submitBid}>Submit</Button>
                            </CardFooter>
                        ) : (
                            <div>no submit</div>
                        )}
                    </Card>
                ))}
            </div>

            <Button>Start Next Round</Button>
        </div>
    );
}
