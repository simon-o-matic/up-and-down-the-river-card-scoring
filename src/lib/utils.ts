import { GameState } from "@/app/gameState";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toPosition(pos: number) {
    return pos === 1 ? "st" : pos === 2 ? "nd" : pos === 3 ? "rd" : "th";
}

export const calculatePlayerTotalScoreSoFar = (
    playerIndex: number,
    gameState: GameState,
    includeLatestHand: boolean = true
) => {
    let total = 0;

    for (let h = 0; h <= gameState.hand - (includeLatestHand ? 0 : 1); h++) {
        const playerBidWon = gameState.players[playerIndex].roundScores[h];

        if (playerBidWon.bid === playerBidWon.won) {
            if (playerBidWon.bid === 0) {
                total += gameState.config.pointsForCorrectZeroBid;
            } else {
                total += gameState.config.pointsForCorrectNonZeroBid;
            }
        }

        total += playerBidWon.won;
    }

    return total;
};
