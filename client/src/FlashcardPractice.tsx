import React, { ChangeEvent, Component, MouseEvent } from "react";
import { Card, toScore } from './Card';
import './style.css'

type FlashcardPracticeProps = {
    deckName: string,
    cards: Card[]
    onFinish: (name: string, deckName: string, value: number) => void;
}

type FlashcardPracticeState = {
    name: string,
    side: "front" | "back",
    correct: number,
    incorrect: number,
    index: number,
    error: string
}

export class FlashcardPractice extends Component<FlashcardPracticeProps, FlashcardPracticeState> {

    constructor(props: FlashcardPracticeProps) {
      super(props);
  
      this.state = {name: "", side: "front", correct: 0, incorrect: 0, index: 0, error: ""}
    }


    render = (): JSX.Element => {
        return <div>  
            <h1>{this.props.deckName}</h1>
            <h2>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h2>
            {this.renderPractice()}
            
        </div>

    }
    
    renderPractice = (): JSX.Element => {
        if (this.state.index === this.props.cards.length) {
            return <div>
                <p>
                    Name: <input type="text" value={this.state.name} onChange={this.doNameChange} />
                    <button onClick={this.doFinishClick}>Finish</button>
                </p>
                {this.renderError()}
            </div>
        } else if (this.state.side === "front") {
            return <div>
                <ul className="card">
                    {this.props.cards[this.state.index].question}
                </ul>
                <button onClick={this.doFlipClick}>Flip</button>
                <button onClick={this.doCorrectClick}>Correct</button>
                <button onClick={this.doIncorrectClick}>Incorrect</button>
            </div>
        } else {
            return <div>
                <ul className="card">
                    {this.props.cards[this.state.index].answer}
                </ul>
                <button onClick={this.doFlipClick}>Flip</button>
                <button onClick={this.doCorrectClick}>Correct</button>
                <button onClick={this.doIncorrectClick}>Incorrect</button>
            </div>
        }
    }

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

    doFinishClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.name.trim() === "") {
            this.setState({error: "Name cannot be empty"});
            return;
        }
        console.log("do finish click");
        this.props.onFinish(this.state.name, this.props.deckName, 
            toScore(this.state.correct, this.state.incorrect));
    };
    
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value});
    };

    doFlipClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.side === "front") {
            this.setState({side: "back"});
        } else {
            this.setState({side: "front"});
        }
    };

    doCorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({correct: this.state.correct + 1, side: "front", index: this.state.index + 1});
    };

    doIncorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({incorrect: this.state.incorrect + 1, side: "front", index: this.state.index + 1});
    };
    
}  