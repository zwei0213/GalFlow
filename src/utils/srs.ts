import { Card } from '../db/db';

// SuperMemo 2 (SM-2) Variant adapted for "Flow Mode"
// Flow Mode: 
// - Up Swipe (Good/Easy): Quality = 4 or 5
// - Left Swipe/Review (Hard/Again): Quality = 1 or 2

export const calculateNextReview = (card: Card, quality: number): Partial<Card> => {
    let { easeFactor, interval, reviewCount } = card;

    // Quality: 0-5 (0=Blackout, 5=Perfect)

    if (quality < 3) {
        // Forgot / Hard
        interval = 1;
        reviewCount = 0; // Reset streak? Or keep streak but reset interval? Standard SM2 resets interval.
    } else {
        // Remembering
        if (reviewCount === 0) {
            interval = 1;
        } else if (reviewCount === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        reviewCount += 1;
    }

    // Update Ease Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // Minimum EF is 1.3
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;

    return {
        easeFactor,
        interval,
        reviewCount,
        dueDate,
        status: quality < 3 ? 'learning' : 'review'
    };
};

export const INITIAL_CARD_STATE = {
    easeFactor: 2.5,
    interval: 0,
    reviewCount: 0,
    status: 'new' as const,
    dueDate: 0 // Immediate
};
