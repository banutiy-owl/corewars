import Game from "./Game";

const GameList = ({ games, onShow }) => (
  <div className="warrior-list">
    {games.length === 0 ? (
      <p className="yet">You have no warriors under your command yet.</p>
    ) : (
      games.map((game) => <Game key={game.id} game={game} onShow={onShow} />)
    )}
  </div>
);

export default GameList;
