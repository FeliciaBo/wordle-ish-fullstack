import "./About.scss"
function About() {
  return (
    <div className="about-page">
      <h1>About this project</h1>
      <p>This is a fullstack application inspired by Wordle. The user can start a game, 
         guess words, and receive feedback on each guess. When the game is completed, 
         the result can be saved to a highscore list. </p>
         
      <p> The application is built with React on the frontend and Node.js/Express on the backend. 
         The server is responsible for selecting words, handling game logic, and storing results in 
         a database. </p>
         
      <p> The project also includes integration tests using Playwright to verify that the full 
         game flow works as expected.</p>

      <h2>Note</h2>
      <p> The UX/UI-design could be definitely improved on, and will be fixed if I find the time XD</p>




    </div>
  );
}

export default About;