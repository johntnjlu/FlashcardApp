export type Card =  {readonly question: string, readonly answer: string}
export type Deck = {readonly name: string, readonly cards: Card[]}
export type Score = {readonly name: string, readonly deckName: string, readonly value: number}

/**
 * Converts the given string to be an array of cards, ignoring fully blank lines.
 * @param s given string to be parsed
 * @returns an array of cards
 */
export const parseCards = (s: string): Card[] => {
  const input: string[] = s.split('\n');
  const cards: Card[] = [];
  for (const card of input) {
    const index: number = card.indexOf("|");
    const question: string = card.substring(0, index);
    const answer: string = card.substring(index + 1);
    if (card !== "") {
      if (index === -1) {
        cards.push({question: "|", answer: "|"}) //signifies missing bar with impossible values
      }
      cards.push({question, answer});
    }
  }
  return cards; 
};

/**
 * Takes the number of correct and incorrect answers and converts it to a percentage score
 * @param correct number of correct answers
 * @param incorrect number of incorrect answers
 * @returns an integer score out of 100
 */
export const toScore = (correct: number, incorrect: number): number => {
  return Math.round(100*(correct/(correct + incorrect)));
}
