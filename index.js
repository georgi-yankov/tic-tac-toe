function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    for (let row = 0; row < 3; row ++) {

      let boardRow = [];
      for (let col = 0; col < 3; col ++) {
        const position =  row * 3 + col;
        boardRow.push(<span key={position}>{this.renderSquare(position)}</span>);
      }

      squares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
          {squares}
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
        lastLocation: null
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastLocation: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,      
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const sortAscending = this.state.sortAscending;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' - ' + getLastLocation(step.lastLocation) :
        'Go to game start';
      return (
        <li key={move}>
          <button className={this.state.stepNumber === move ? 'selected-move' : ''} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>          
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="sort-btn-wrapper">
            <button onClick={() => this.setState({sortAscending: !this.state.sortAscending})}>
              Sort by: {sortAscending ? 'descending' : 'ascending'} 
            </button>
          </div>
          {sortAscending ? <ol>{moves}</ol> : <ol reversed>{moves.reverse()}</ol>}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// 1. Display the location for each move in the format (col, row)
// in the move history list.
function getLastLocation(move) {
  const MOVES = {
    0: '(1, 1)',
    1: '(2, 1)',
    2: '(3, 1)',
    3: '(1, 2)',
    4: '(2, 2)',
    5: '(3, 2)',
    6: '(1, 3)',
    7: '(2, 3)',
    8: '(3, 3)'
  };
  return MOVES[move];
}
