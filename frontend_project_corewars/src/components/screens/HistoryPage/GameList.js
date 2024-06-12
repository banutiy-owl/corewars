import Game from "./Game";

const GameList = ({ games, onShow }) => (
  <div className="warrior-list">
    {games.length === 0 ? (
      <p className="yet">You have no games played yet.</p>
    ) : (
      games.map((game, index) => <Game key={game.id} game={game} game_number = {games.length-index} onShow={onShow} />)
    )}
  </div>
);

export default GameList;
