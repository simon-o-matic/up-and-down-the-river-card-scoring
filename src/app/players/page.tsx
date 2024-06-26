"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useGameState, Player } from "../gameState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const PlayerView = ({
    key,
    name,
    onClick,
}: {
    key: string;
    name: string;
    onClick: () => void;
}) => (
    <li key={key}>
        Player name: {name} <Button onClick={onClick}>↑</Button>
    </li>
);

export default function PlayersList() {
    const gameState = useGameState();
    const updatePlayers = useGameState().updatePlayers;

    const [open, setOpen] = React.useState(false);
    const [currentName, setCurrentName] = React.useState("");
    const router = useRouter();

    const addPlayer = (name: string) => {
        setOpen(false);
        const newPlayer: Player = { name, id: name, roundScores: [] };
        gameState.players.push(newPlayer);
        updatePlayers(gameState.players);
    };

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
        updatePlayers(gameState.players);
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
        gameState.updatePlayers(
            addEmptyRoundsToPlayers(
                gameState.players,
                gameState.handsUpRiver * 2
            )
        );

        router.replace("/bid");
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex h-full justify-center text-3xl mb-3">
                Players List
            </div>
            <hr></hr>

            {gameState.players.map(p => (
                <div
                    className="flex flex-row w-full justify-between"
                    key={p.id}
                >
                    Player name: {p.name}{" "}
                    <Button onClick={() => movePlayerUp(p.id)}>↑</Button>
                </div>
            ))}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline">Add Player</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-blue-300">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Player Name</Label>
                                <Input
                                    id="width"
                                    defaultValue=""
                                    className="col-span-2 h-8"
                                    onChangeCapture={e => {
                                        setCurrentName(e.currentTarget.value);
                                    }}
                                />
                            </div>
                            <Button
                                className="bg-gray-500"
                                onClick={() => addPlayer(currentName)}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <Button onClick={startFirstRound}>Start Round 1</Button>
        </div>
    );
}
