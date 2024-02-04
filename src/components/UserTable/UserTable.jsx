import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function UserTable() {
  const [data, setData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc"); // State to track sort direction
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const deleteUser = async (user_id) => {
    try {
      await deleteDoc(doc(db, "users", user_id));
      setData(data.filter((item) => item.id !== user_id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (user_id) => {
    try {
      const prevData = data;
      const user = data.find((item) => item.id === user_id);
      const updatedActiveStatus = !user.user.active;
      await updateDoc(doc(db, "users", user_id), {
        user: {
          ...user.user,
          active: updatedActiveStatus,
        },
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Function to handle sorting by name
  const handleSortByName = () => {
    const sortedData = [...data];
    if (sortDirection === "asc") {
      sortedData.sort((a, b) => a.user.username.localeCompare(b.user.username));
      setSortDirection("desc");
    } else {
      sortedData.sort((a, b) => b.user.username.localeCompare(a.user.username));
      setSortDirection("asc");
    }
    setData(sortedData);
  };

  const handleSortByDateAdded = () => {
    // Sort by added date
    const sortedData = [...data].sort((a, b) => {
      const dateA = a.timeStamp.toDate();
      const dateB = b.timeStamp.toDate();

      if (sortDirection === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setData(sortedData);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // Toggle sort direction
  };

  const handleSortByStatus = () => {
    // Sort by active status
    const sortedData = [...data].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.user.active - b.user.active;
      } else {
        return b.user.active - a.user.active;
      }
    });

    setData(sortedData);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // Toggle sort direction
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <button
          onClick={(e) => navigate("/")}
          className="w-full mt-4 ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Home
        </button>
        <h1 className="mr-6 text-white text-4xl ml-6">Active users</h1>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <div
                className="flex items-center cursor-pointer"
                onClick={handleSortByName}
              >
                Name
                <svg
                  className="w-3 h-3 ms-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                </svg>
              </div>
            </th>
            <th scope="col" className="cursor-pointer px-6 py-3">
              <div
                className="flex items-center"
                onClick={handleSortByDateAdded}
              >
                Added date
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center" onClick={handleSortByStatus}>
                Status
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((user) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={user.id}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.user.img}
                    alt="image"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {user.user.username}
                    </div>
                    <div className="font-normal text-gray-500">
                      {user.user.email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  {user.timeStamp.toDate().toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center me-5 cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={user.user.active}
                        onChange={(e) => updateStatus(user.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      <span className="ms-3 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {user.user.active ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={(e) => deleteUser(user.id)}
                    >
                      Delete user
                    </a>
                  </div>

                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={(e) => navigate("/add-user")}
                  >
                    Add user
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
