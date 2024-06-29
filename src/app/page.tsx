"use client";

import React, { useEffect, useState } from "react";

import { Player, useGameState } from "./gameState";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
    const router = useRouter();
    const gameState = useGameState();

    const [handsUpRiver, setHandsUpRiver] = useState(
        String(gameState.handsUpRiver)
    );

    const setPlayerName = (playerIndex: number, name: string) => {
        gameState.players[playerIndex].name = name;
        gameState.updatePlayers(gameState.players);
    };

    const addPlayer = () => {
        gameState.players.push({
            id: String(Math.random()),
            name: "",
            roundScores: [],
        });
        gameState.updatePlayers(gameState.players);
    };

    const deletePlayer = (playerId: string) => {
        if (gameState.players.length <= 2) {
            return;
        }

        const playerIndex = gameState.players.findIndex(p => p.id === playerId);
        gameState.players.splice(playerIndex, 1);
        gameState.updatePlayers(gameState.players);
    };

    useEffect(() => {
        // start the game with two empty players
        if (gameState.players.length === 0) {
            addPlayer();
            addPlayer();
        }
    }, [gameState.players]);

    const movePlayerUp = (playerId: string) => {
        const currentIndexOfPlayer = gameState.players.findIndex(
            p => p.id === playerId
        );

        const currentPlayer = gameState.players[currentIndexOfPlayer];

        // Add the same player in the new spot
        gameState.players.splice(currentIndexOfPlayer - 1, 0, currentPlayer);

        // Remove the old one (which is now a duplicadte) remember it has moved down one
        gameState.players.splice(currentIndexOfPlayer + 1, 1);

        // update the game state
        gameState.updatePlayers(gameState.players);
    };

    const addEmptyRoundsToPlayers = (players: Player[], hands: number) =>
        players.map(player => {
            const emptyBids = [];
            for (let i = 0; i < hands; i++) {
                emptyBids.push({ bid: 0, won: 0 });
            }

            player.roundScores = emptyBids;

            return { ...player };
        });

    const startFirstRound = () => {
        // create empty player roundsScores (bids and wons) for all players
        const hands = Number(handsUpRiver);

        if (isNaN(hands)) {
            alert("Please choose how many hands up the river you will play");
        } else if (hands * gameState.players.length > 52) {
            alert(
                "There are enough cards for that many players! Reduce the number of hands maybe"
            );
        } else if (hands <= 0 || hands > 26) {
            alert("Thats not a reasonable number of hands to play. Try again.");
        } else if (
            gameState.players.filter(p => p.name.trim().length > 0).length < 2
        ) {
            alert("You need at least two players to play");
        } else {
            gameState.setHandsUpRiver(hands);
            gameState.updatePlayers(
                addEmptyRoundsToPlayers(
                    gameState.players,
                    gameState.handsUpRiver * 2
                )
            );
            gameState.setStage("playing");
            router.push("/bid");
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="mb-4">
                <h4>Welcome to...</h4>
            </div>

            <div className="flex flex-col justify-center items-center mb-10">
                <div className="flex text-3xl text-center">
                    Up And Down The River
                </div>
                <div className="flex text-xl text-center">
                    Card Game Scoring App
                </div>
            </div>

            <div className="flex flex-col text-xl mb-2">
                How many hands up the river?
            </div>

            <Input
                id="hands"
                defaultValue="7"
                className="col-span-2 h-10 w-20 mb-6 text-base"
                onChange={e => {
                    setHandsUpRiver(e.currentTarget.value);
                }}
            />

            <div className="flex h-full  text-xl mb-2">
                Name your players (min 2)
            </div>

            {gameState.players.map((p, i) => (
                <div key={p.id}>
                    <div className="flex flex-row justify-between my-1 ">
                        <div className="flex flex-row align-text-bottom">
                            <div className="flex align-bottom"></div>
                            <div>
                                <Input
                                    id={String(i)}
                                    className="max-w-60"
                                    value={p.name}
                                    maxLength={25}
                                    onChange={e => {
                                        setPlayerName(i, e.currentTarget.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex ml-3 flex-nowrap">
                            <Button
                                className=""
                                onClick={() => movePlayerUp(p.id)}
                            >
                                ↑
                            </Button>
                            <Button
                                className="ml-3"
                                onClick={() => deletePlayer(p.id)}
                            >
                                🗑
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex w-full justify-start my-1">
                <Button
                    className="bg-gray-300 hover:bg-sky-400"
                    onClick={() => addPlayer()}
                >
                    Add Player
                </Button>
            </div>
            <div className="flex justify-center mt-5">
                <Button onClick={startFirstRound} className="h-10 bg-sky-400 ">
                    Start The First Hand!
                </Button>
            </div>
        </div>
    );
}
