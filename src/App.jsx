import "./App.css";
import HomePage from "./components/Home/HomePage";
import PageNotFound from "./components/PageNotFound";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { Route, Routes } from "react-router-dom";
import ProtectedHomePage from "./components/RouteProtections/ProtectedHomePage";
import ProtectedAuth from "./components/RouteProtections/ProtectedAuth";
import UserTable from "./components/UserTable/UserTable";
import AddUserForm from "./components/UserTable/AddUserForm";

function App() {
  return (
    <div>
      <Routes>

        <Route element={<ProtectedHomePage />}>
          <Route path="/" element={<HomePage />} />
          <Route path="user-table" element={<UserTable />} />
          <Route path="add-user" element={<AddUserForm />} />
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
