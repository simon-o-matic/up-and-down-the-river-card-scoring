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

const initialPlayers: Player[] = [];

export type GameState = {
    players: Player[];
    hand: number;
    handsUpRiver: number;
    stage: string; // enum: "pre-game" or "playing"
    config: {
        pointsForCorrectZeroBid: number;
        pointsForCorrectNonZeroBid: number;
    };

    setStage: (stage: string) => void;
    updatePlayers: (players: Player[]) => void;
    setHandsUpRiver: (hands: number) => void;
    changeBid: (hand: number, playerIndex: number, bid: number) => void;
    changeWon: (hand: number, playerIndex: number, won: number) => void;
    nextHand: () => void;
};

export const useGameState = create<GameState>(set => ({
    players: initialPlayers,
    hand: 0,
    handsUpRiver: 7,
    stage: "pre-game", // default.
    config: {
        pointsForCorrectZeroBid: 5,
        pointsForCorrectNonZeroBid: 10,
    },

    setStage: (stage: string) => {
        set(state => ({
            ...state,
            stage,
        }));
    },

    updatePlayers: (players: Player[]) =>
        set(state => ({
            ...state,
            players: players,
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

    changeWon: (hand: number, playerIndex: number, won: number) =>
        set(state => {
            /** the array of hands they have played and their bid/win for each */
            state.players[playerIndex].roundScores[hand].won = won;

            // make a copy of the state so its considered new
            return {
                ...state,
            };
        }),

    nextHand: () =>
        set(state => {
            state.hand++;
            return { ...state };
        }),

    // nextRound - adds one to the round number
    // endGame - finishes the round and shows high-scores. Can still change config
    // not playering - resets all the scores, but not the player list (so don't have to enter again)
}));
