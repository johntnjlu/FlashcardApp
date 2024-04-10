import React, { Component} from "react";
import { FlashcardList } from "./FlashcardList";
import { FlashcardCreate } from "./FlashcardCreate";
import { FlashcardPractice } from "./FlashcardPractice"
import { isRecord } from "./record";
import {Card} from "./Card";

// RI: If page is "practice", then deckName, the quiz name, exists.
type Page = {kind: "list"} 
  | {kind: "create"} 
  | {kind: "practice", deckName: string}

  type FlashcardAppState = {
    page: Page, 
    decks: string[],
    scores: string[],
    currentPractice: string
    cards: Card[]
  }

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {page: {kind: "list"}, decks: [], scores: [], currentPractice: "", cards: []};
  }

  componentDidMount = (): void => {
    this.doRefreshListTimeout();
    this.doRefreshScoreTimeout();
  }
  
  render = (): JSX.Element => {
    if (this.state.page.kind === "list") {
      console.log("rendering list page");
      return <FlashcardList deckNames={this.state.decks}
                            scores={this.state.scores}
                            onNewClick={this.doNewClick}
                            onPracticeClick={(name) => this.doPracticeClick(name)}/>;

    } else if (this.state.page.kind === "create") {
      console.log("rendering create page");
      return <FlashcardCreate deckNames={this.state.decks}
                              onSave={this.doSaveClick}
                              onBack={this.doBackClick}/>;

    } else {  // details
      console.log(`rendering practice page for "${this.state.page.deckName}"`);
      return <FlashcardPractice deckName={this.state.page.deckName}
                                cards={this.state.cards}
                                onFinish={(name, deckName, value) => this.doGradeClick(name, deckName, value)}/>;
    }
  };


  // Requests for FlashcardList:

  // requests list of deck names from server
  doRefreshListTimeout = (): void => {
    fetch("/api/list")
      .then(this.doListResp)
      .catch(() => this.doListError("failed to connect"));
  }

  doListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doListJson)
         .catch(() => this.doListError("not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doListError)
         .catch(() => this.doListError("not text"));
    } else {
      this.doListError(`bad status: ${res.status}`);   
    }
  };

  doListJson = (data: unknown): void => {
    console.log("updating deck names");
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }
    if (!Array.isArray(data)) {
      console.error("not an array", data);
      return undefined;
    }
    this.setState({decks: data});
  }

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };  

  // requests score list from server
  doRefreshScoreTimeout = (): void => {
    fetch("/api/scorelist")
      .then(this.doScoreResp)
      .catch(() => this.doScoreError("failed to connect"));
  }

  doScoreResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doScoreJson)
         .catch(() => this.doScoreError("not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doScoreError)
         .catch(() => this.doScoreError("not text"));
    } else {
      this.doScoreError(`bad status: ${res.status}`);   
    }
  };

  doScoreJson = (data: unknown): void => {
    console.log("updating score list: " + data);
    if (!isRecord(data)) {
      console.error("bad data from /api/scorelist: not a record", data);
      return;
    }
    if (!Array.isArray(data)) {
      console.error("not an array", data);
      return undefined;
    }
    this.setState({scores: data});
  }

  doScoreError = (msg: string): void => {
    console.error(`Error fetching /api/scorelist: ${msg}`);
  };  


  // requests for FlashcardCreate:

  // posts the created flashcards
  doSaveClick = (deckName: string, cards: Card[]): void => {
    console.log("do save click");
    const args = {name: deckName, value: cards}
    fetch("/api/save", {method: "POST", 
      body: JSON.stringify(args), 
      headers: {"Content-Type": "application/json"}})
    .then(this.doSaveResp)
    .catch(() => this.doSaveError("failed to connect"))
  }
  
  doSaveResp = (res: Response): void => {
    console.log("do save resp");
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
        .catch(() => this.doSaveError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
        .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code ${res.status}`);
    }
  };

  doSaveJson = (data: unknown): void => {
    console.log("setting state to list");
    if (!isRecord(data)) {
      console.error("bad data from /api/save: not a record", data);
      return;
    }
    this.doRefreshListTimeout();
    console.log("decks: " + this.state.decks);
    this.componentDidMount();
    this.setState({page: {kind: "list"}});
  }

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

  
  // Requests for FlashcardPractice

  // loads the flashcards corresponding to the given deck name
  doPracticeClick = (name: string): void => {
    const url = "/api/load?" + "deckName=" + encodeURIComponent(name);
        fetch(url)
          .then(response => this.doLoadResp(response, name))
          .catch(() => this.doLoadError("failed to connect"));
  }

  doLoadResp = (res: Response, name: string): void => {
    if (res.status === 200) {
        res.json().then(data => this.doLoadJson(data, name))
            .catch(() => this.doLoadError("not JSON"));
    } else if (res.status === 400) {
        res.text().then(this.doLoadError)
            .catch(() => this.doLoadError("not text"));
    } else {
        this.doLoadError(`bad status: ${res.status}`);   
    }
  }

  doLoadJson = (data: unknown, name: string): void => {
    if (!isRecord(data)) {
        console.error("bad data from /api/load: not a record", data);
        return;
    }

    if (!Array.isArray(data)) {
        console.error("bad data from /api/load: not a record", data);
        return;
    }
    this.setState({page: {kind: "practice", deckName: name}, cards: data});
  }

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /api/load: ${msg}`);
  };


  // posts the practice score 
  doGradeClick = (name: string, deckName: string, value: number): void => {
    console.log("do grade click");
    const args = {name: name, deckName: deckName, value: value}
    console.log("grading:" + args);
    fetch("/api/grade", 
      {method: "POST", 
      body: JSON.stringify(args), 
      headers: {"Content-Type": "application/json"}})
    .then(this.doGradeResp)
    .catch(() => this.doGradeError("failed to connect"))
  }
  
  doGradeResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doGradeJson)
        .catch(() => this.doGradeError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doGradeError)
        .catch(() => this.doGradeError("400 response is not text"));
    } else {
      this.doGradeError(`bad status code ${res.status}`);
    }
  };

  doGradeJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/grade: not a record", data);
      return;
    }
    this.doRefreshScoreTimeout();
    this.setState({page: {kind: "list"}});
  }

  // Called when we fail trying to save an item
  doGradeError = (msg: string): void => {
    console.error(`Error fetching /api/grade: ${msg}`);
  };

  doBackClick = (): void => {
    console.log("pressed back");
    this.doRefreshListTimeout();
    this.setState({page: {kind: "list"}});
  }

  doNewClick = (): void => {
    console.log("set state to create");
    this.setState({page: {kind: "create"}});
  };
}