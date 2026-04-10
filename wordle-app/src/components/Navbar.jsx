import { Link } from "react-router-dom";
import "./Navbar.scss";

function Navbar() {
  return (
    <nav>
      <Link to="/">Wordle Game</Link> {" "}
      <a href="/highscores">Highscores</a>
      <Link to="/about">About</Link>

      
    </nav>
  );
}

export default Navbar;