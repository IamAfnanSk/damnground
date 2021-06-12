import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home/Home"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route exact path={"/:id"} component={Home} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
