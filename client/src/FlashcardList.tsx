import React, { Component, MouseEvent } from 'react';

type ListProps = {
    deckNames: string[],
    scores: string[],
    onNewClick: () => void,
    onPracticeClick: (deckName: string) => void;
};

// Shows the list of all the decks.
export class FlashcardList extends Component<ListProps, {}> {
  constructor(props: ListProps) {
    super(props);
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h1>List</h1>
        {this.renderList()}
        <button type="button" onClick={this.doNewClick}>Create</button>
        <h1>Scores</h1>
        {this.renderScores()}
      </div>);
  };

  renderList = (): JSX.Element => {
    console.log("called renderList");
    const list: JSX.Element[] = []
    if (this.props.deckNames === undefined) {
        return <p>Loading flashcard list...</p>;
    }
    for (const deck of this.props.deckNames) {
      list.push(
      <ul> 
        <a href="#" onClick={() => this.doPracticeClick(deck)}>{deck}</a>
      </ul>
      )
    }

    return <div>{list}</div>
  }

  renderScores = (): JSX.Element => {
    console.log("called renderScores");
    if (this.props.scores === undefined) {
      return <p>Loading scores list...</p>;
    } 
    const temp: JSX.Element[] = [];
    for (const score of this.props.scores) {
      temp.push(
        <ul>
          <p>{score}</p>
        </ul>);
    }
    console.log("finished renderscores: temp = " + temp);
    return <div>{temp}</div>;
  }

  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    console.log(this.props.deckNames)
    this.props.onNewClick(); 
  };

  doPracticeClick = (name: string): void => {
    this.props.onPracticeClick(name);
  };

}
