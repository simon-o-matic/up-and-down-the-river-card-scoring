// TODO: game config

import { create } from "zustand";

type PlayerRoundScore = {
    bid: number;
    won: number;
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
    hand: number;
    handsUpRiver: number;
    stage: string; // enum: "pre-game", "playing", "finished", "mid-round", "round-complete"

    updatePlayers: (players: Player[]) => void;
    setHandsUpRiver: (hands: number) => void;
    changeBid: (hand: number, playerIndex: number, bid: number) => void;
};

export const useGameState = create<GameState>(set => ({
    players: initialPlayers,
    hand: 0,
    handsUpRiver: 0,
    stage: "pre-game",

    updatePlayers: (players: Player[]) =>
        set(state => ({
            ...state,
            players: (state.players = players),
        })),

    setHandsUpRiver: (hands: number) =>
        set(state => ({
            ...state,
            handsUpRiver: hands,
        })),

    /** change a bid from any hand */
    changeBid: (hand: number, playerIndex: number, bid: number) =>
        set(state => {
            /** the array of hands they have played and their bid/win for each */
            state.players[playerIndex].roundScores[hand].bid = bid;

            // make a copy of the state so its considered new
            return {
                ...state,
            };
        }),

    // nextRound - adds one to the round number
    // endGame - finishes the round and shows high-scores. Can still change config
    // not playering - resets all the scores, but not the player list (so don't have to enter again)
}));
