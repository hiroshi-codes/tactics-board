import appLogo from "/logo.png";

import { Link } from "react-router-dom";

function App() {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Link to="/tactics-board/half-court">
          <img src={appLogo} alt="tactics-board logo" />
        </Link>
      </div>
      <h1 className="text-6xl">tactics board</h1>
      <p>©︎ hiroshi-codes</p>
    </div>
  );
}

export default App;
