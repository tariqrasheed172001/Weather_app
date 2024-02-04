import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SignIn from "../Auth/SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

function ProtectedHomePage() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return <div>{authUser ? <Outlet /> : <SignIn />}</div>;
}

export default ProtectedHomePage;
