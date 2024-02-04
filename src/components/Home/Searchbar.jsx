import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions, GEO_API_URL } from "../../api";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Searchbar = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();

  const loadOptions = async (inputValue) => {
    console.log(inputValue);
    const response = await fetch(
      `${GEO_API_URL}cities/?minPopulation=100000&namePrefix=${inputValue}`,
      geoApiOptions
    );

    const response_1 = await response.json();
    console.log(response_1);
    return {
      options: response_1.data.map((city) => {
        return {
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        };
      }),
    };
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successfully");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-black text-white p-5">
      <div className="flex items-center w-full sm:w-auto justify-center mb-3 sm:mb-0">
        <img src="icons/13d.png" alt="" className="w-10" />
        <p className="text-2xl">Weather Now</p>
      </div>
      <div className="w-full sm:w-auto mb-3 sm:mb-0">
        <AsyncPaginate
          placeholder="Search for city"
          onFocus={() => setSearch("")}
          debounceTimeout={600}
          value={search}
          onChange={handleOnChange}
          loadOptions={loadOptions}
          className="w-full sm:w-60% mx-auto text-black text-xl"
        />
      </div>
      <button
        onClick={(e) => navigate("/user-table")}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Active users
      </button>
      <button
        onClick={userSignOut}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Searchbar;
