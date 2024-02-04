import "./App.css";
import HomePage from "./components/Home/HomePage";
import PageNotFound from "./components/PageNotFound";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { Route, Routes } from "react-router-dom";
import ProtectedHomePage from "./components/AuthProtections/ProtectedHomePage";
import ProtectedAuth from "./components/AuthProtections/ProtectedAuth";

function App() {
  return (
    <div>
      <Routes>

        <Route element={<ProtectedHomePage />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        
        <Route element={<ProtectedAuth />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Catch-all route for non-existing paths */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
