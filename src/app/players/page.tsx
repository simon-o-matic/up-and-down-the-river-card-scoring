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

        console.log(
            "moving player up " +
                playerId +
                " from index " +
                currentIndexOfPlayer
        );

        const currentPlayer = gameState.players[currentIndexOfPlayer];

        // Add the same player in the new spot
        gameState.players.splice(currentIndexOfPlayer - 1, 0, currentPlayer);

        // Remove the old one (which is now a duplicadte) remember it has moved down one
        gameState.players.splice(currentIndexOfPlayer + 1, 1);

        // update the game state
        updatePlayers(gameState.players);

        console.log(gameState.players);
    };

    const startFirstRound = () => {
        router.push("/bid");
    };

    return (
        <div className="h-full">
            <div className="bg-blue-500">Players List </div>
            <hr></hr>

            {gameState.players.map(p => (
                <PlayerView
                    onClick={() => movePlayerUp(p.id)}
                    key={p.id}
                    name={p.name}
                ></PlayerView>
            ))}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline">Add Player</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                                Dimensions
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Set the dimensions for the layer.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Player Name</Label>
                                <Input
                                    id="width"
                                    defaultValue="johnny"
                                    className="col-span-2 h-8"
                                    onChangeCapture={e => {
                                        setCurrentName(e.currentTarget.value);
                                        console.log(
                                            "current: " + e.currentTarget.value
                                        );
                                    }}
                                />
                            </div>
                            <Button onClick={() => addPlayer(currentName)}>
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
