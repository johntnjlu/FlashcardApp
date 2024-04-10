import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Card, parseCards } from "./Card";

type FlashcardCreateProps = {
/** Initial state of the file. */
    deckNames: string[]
    onSave: (deckName: string, cards: Card[]) => void;
    onBack: () => void;
};

type FlashcardCreateState = {
    name: string,
    currentString: string,
    error: string;
};

/** UI for editing the image. */
export class FlashcardCreate extends Component<FlashcardCreateProps, FlashcardCreateState> {

  constructor(props: FlashcardCreateProps) {
    super(props);
    this.state = {name: "", currentString: "", error: ""};
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    return <div>
        <p>
          Enter New Deck Name: <input type="text" value={this.state.name} onChange={this.doDeckNameChange} />
        </p>
        <div>
            <label htmlFor="textbox">Options (one per line, formatted as front|back)</label>
            <br></br>
            <textarea id="textbox" rows={8} cols={60} value={this.state.currentString}
                onChange={this.doInputChange}></textarea>
        </div>
      <button onClick={this.doSaveClick}>Add</button>
      <button onClick={this.doBackClick}>Back</button>
      {this.renderError()}
    </div>
  };

  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}><b>Error</b>: {this.state.error}</span>
        </div>);
    }
  };

  doSaveClick = (): void => {
    console.log("do add click");
    if (this.state.name.trim() === "") {
      this.setState({error: "Name cannot be empty"});
      return;
    }
    if (this.props.deckNames.includes(this.state.name)) {
      this.setState({error: "Quiz already exists"});
      return;
    }
    if (this.state.currentString === "") {
      this.setState({error: "No cards"});
      return;
    }
    const cards: Card[] = parseCards(this.state.currentString);
    for (const card of cards) {
      if (card.question.trim() === "" || card.answer.trim() === "") {
        this.setState({error: "Question or answer cannot be blank"});
        return;
      }
      if (card.question === "|" && card.answer === "|") {
        this.setState({error: 'missing "|" symbol'});
        return;
      }
    }
    this.setState({error: ""});
    this.props.onSave(this.state.name, cards);
  }

  doDeckNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value});
  };
  
  doInputChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({currentString: evt.target.value});
  };

  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    console.log("do back click");
    this.props.onBack();
  };
}