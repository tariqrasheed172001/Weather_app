import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function AuthDetails() {
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

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successfully");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser ? (
        <>
          <p>{`Signed In ${authUser.email}`}</p>{" "}
          <button
            onClick={userSignOut}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            sign Out
          </button>{" "}
        </>
      ) : (
        <p>Signed out</p>
      )}
    </div>
  );
}

export default AuthDetails;
