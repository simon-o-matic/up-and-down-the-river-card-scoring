// TODO: game config

import { create } from "zustand";

type PlayerRoundScore = {
    bid: number | undefined;
    won: number | undefined;
};

export type Player = {
    id: string;
    name: string;
    roundScores: PlayerRoundScore[];
};

// TEST DATA
const initialPlayers: Player[] = [
    {
        id: "jk4j65",
        name: "suzy q",
        roundScores: [],
    },
    {
        id: "wkhu34r",
        name: "mike w",
        roundScores: [],
    },
];

type GameState = {
    players: Player[];
    round: number;
    stage: string; // enum: "pre-game", "playing", "finished", "mid-round", "round-complete"

    updatePlayers: (players: Player[]) => void;
};

export const useGameState = create<GameState>(set => ({
    players: initialPlayers,
    round: 0,
    stage: "pre-game",

    updatePlayers: (players: Player[]) =>
        set(state => ({
            ...state,
            players: (state.players = players),
        })),
    // nextRound - adds one to the round number
    // endGame - finishes the round and shows high-scores. Can still change config
    // not playering - resets all the scores, but not the player list (so don't have to enter again)
}));
