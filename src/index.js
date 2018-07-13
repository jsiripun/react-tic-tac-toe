import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
      <button 
	  className="square" 
	  onClick={props.onClick}
	  style={props.color}>
        {props.value}
      </button>
    );
 }

 
class Board extends React.Component {
	
  renderSquare(i) {
	 const winner = calculateWinner(this.props.squares);
	  
	  if(winner && (winner[1][0] === i || winner[1][1] === i || winner[1][2] === i)) {
		return (
		  <Square
			key = {i}
			value={this.props.squares[i]}
			onClick={() => this.props.onClick(i)}
			color={{backgroundColor: 'yellow'}}
		  />
		  );
	  } else {
		return (
		  <Square
			key = {i}
			value={this.props.squares[i]}
			onClick={() => this.props.onClick(i)}
		  />
		  );
	  }
  }

  createSquares() {
    let rows=[];
	for (let i = 0; i < 3; i++) {
		let squares = []
		for (let j = 0; j < 3; j++) {
			squares.push(this.renderSquare((i*3)+j));
		}
		rows.push(<div key={i} className="board-row">{squares}</div>);
	}
	
	return rows;
 }
  
  render() {
  
	return (
      <div>
		{this.createSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				moveColumn: null,
				moveRow: null,
				archStep: 0,
			}],
			stepNumber: 0,
			xIsNext: true,
			listAsc: true,
		}
	}
	
  handleClick(i) {
	  let num = this.state.stepNumber+1;
	  let history = this.state.history.slice(0, num);
	  
	
	if(this.state.listAsc) {
		const current = history[history.length-1];
		const squares = current.squares.slice();
		if(calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		
		this.setState({
		history: history.concat([{
			squares: squares,
			moveRow: getRow(i),
			moveColumn: getColumn(i),
			archStep: history.length,
		}]),
		stepNumber: history.length,
		xIsNext: !this.state.xIsNext,
		});	
	} else {
		const current = history[this.state.stepNumber];
		const squares = current.squares.slice();
		history = this.state.history.slice(this.state.stepNumber);
		console.log(history);
		if(calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		
		let newAdd= [{
			squares: squares,
			moveRow: getRow(i),
			moveColumn: getColumn(i),
			archStep: history.length,
		}];
		
		this.setState({
		history: newAdd.concat(history),
		stepNumber: 0,
		xIsNext: !this.state.xIsNext,
    });
	}
	
    
  }
  
  jumpTo(step) {
	this.setState({
		stepNumber: step,
		xIsNext: (step % 2) === 0,
	});
  }
  
  toggleHistory(history) {
	  const currHistory = this.state.history.slice();
	  let newStepNum = this.state.history.length - 1;
	  if(this.state.listAsc) {
		newStepNum = 0;
	  }
	  this.setState ({
		  listAsc: !this.state.listAsc,
		  history: currHistory.reverse(),
		  stepNumber: newStepNum,
	  });
	  
  }
	
  render() {
	  const history = this.state.history;
	  let current = history[this.state.stepNumber];
	  
	  const winner = calculateWinner(current.squares);
	  const isADraw = checkDraw(current.squares);
	  
	  
	  
	  const moves = history.map((step, move) => {
		  const desc = step.archStep ?
			'Go to move #' + step.archStep :
			'Go to game start';
			if(step === current) {
				return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
					<b><p>({step.moveColumn}, {step.moveRow})</p></b>
				</li> );
			} else {
			return (
			<li key={move}>
				<button onClick={() => this.jumpTo(move)}>{desc}</button>
				<p>({step.moveColumn}, {step.moveRow})</p>
			</li> ); }
	  });
	  
	  let status;
	  if(winner) {
		status = 'Winner: ' + winner[0];
	  } else if(isADraw) {
		status = "It's a draw!"; 
	  } else {
		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	  }
	  
    return (
      <div className="game">
        <div className="game-board">
          <Board 
			squares = {current.squares}
			onClick={(i) => this.handleClick(i)}
		  />
        </div>
        <div className="game-info">
          <div><button onClick={(history) => this.toggleHistory(history)}>Toggle</button></div>
		  <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function getRow(i) {
	if( i < 3) {
		return 1; 
	}
	else if (i >= 3 && i < 6) {
		return 2;
	} else {
		return 3;
	}
}

function getColumn(i) {
	return (i % 3) + 1;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
	let toReturn = [];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		toReturn[0] = squares[a];
		toReturn[1] = lines[i];
      return toReturn;
    }
  }
  return null;
}

function checkDraw(squares) {
	let isADraw = false;
	for(let i = 0; i < squares.length; i++) {
		if(!squares[i])
		{
			return isADraw;
		}
	}
	
	isADraw = true;
	return isADraw;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
