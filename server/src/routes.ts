import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

const decks: Map<string, unknown> = new Map();
const scores: string[] = [];

/** Handles request for /api/save by storing the given file. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }

  console.log("deck saved");
  decks.set(name, value);
  res.send({status: "200: good"});
}

/** Handles request for /api/load by returning the deck requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const deckName = first(req.query.deckName);
  if (deckName === undefined) {
    res.status(400).send('required argument "deckName" was missing');
    return;
  }
  if (!decks.has(deckName)) {
    res.status(404).send('no deck previously saved with that name');
    return;
  }
  res.send(decks.get(deckName))
  console.log("deck loaded");
}

/** Handles request for /api/list by returning the list of decks */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  res.send(Array.from(decks.keys()));
  console.log("decks listed");
}

/** Handles request for /api/scorelist by returning the list of scores */
export const scorelist = (_req: SafeRequest, res: SafeResponse): void => {
  res.send(scores);
  console.log("scores listed: " + scores)
}

/** Handles request for /api/grade by storing the given score  */
export const grade = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const deckName = req.body.deckName;
  if (deckName === undefined || typeof deckName !== 'string') {
    res.status(400).send('required argument "deckName" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined || typeof value !== 'number') {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  console.log("file saved");
  res.send({status: "200: good"});
  scores.push(name + ", " + deckName + ": " + value);
}

/** Used in tests to clear decks*/
export const resetDecksForTesting = (): void => {
  decks.clear();
}

/** Used in tests to clear scores */
export const resetScoresForTesting = (): void => {
  scores.length = 0;
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
