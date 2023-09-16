import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home/Home"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/:id"} element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
