import { Link } from "react-router-dom";
import "./Navbar.scss";

function Navbar() {
  return (
    <nav>
      <Link to="/">Wordle Game</Link> {" "}
      <Link to="/about">About</Link>
      
    </nav>
  );
}

export default Navbar;