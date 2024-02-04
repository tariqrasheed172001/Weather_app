import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
const AddUserForm = () => {
  const [file, setFile] = useState("");
  const [perc, setperc] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
    active: true,
  });

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("upload is " + progress + "% done");
          setperc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloaURL) => {
            console.log("File avialable at", downloaURL);
            setUser((prev) => ({ ...prev, img: downloaURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (perc !== null && perc < 100) {
      alert("image is uploading wait!");
    } else {
      if (user.password === user.confirmPassword) {
        try {
          const res = await createUserWithEmailAndPassword(
            auth,
            user.email,
            user.password
          );
          await setDoc(doc(db, "users", res.user.uid), {
            user,
            timeStamp: serverTimestamp(),
          });
          navigate("/user-table");
          // Reset the form fields after submission
          setUser({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setFile(""); // Clear the file input
        } catch (error) {
          alert(error.message);
          console.log(error);
        }
      } else {
        alert("passwords do not match");
        console.log("passwords do not match");
      }
    }
  };

  console.log(user);
  return (
    <section className="container w-full mx-auto items-center py-4">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New User</h2>
        <div className="px-4 py-6">
          <div
            id="image-preview"
            className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer"
          >
            {file ? (
              <img src={URL.createObjectURL(file)} />
            ) : (
              <div>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label for="upload" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-700 mx-auto mb-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                    Upload picture
                  </h5>
                  <p className="font-normal text-sm text-gray-400 md:px-6">
                    Choose photo size should be less than{" "}
                    <b className="text-gray-600">2mb</b>
                  </p>
                  <p className="font-normal text-sm text-gray-400 md:px-6">
                    and should be in{" "}
                    <b className="text-gray-600">JPG, PNG, or GIF</b> format.
                  </p>
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  ></span>
                </label>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center mb-8">
            {file && (
              <div className="w-full">
                <label className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  <span
                    className="text-center ml-2"
                    onClick={(e) => setFile("")}
                  >
                    Cancel
                  </span>
                </label>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={user.username}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={user.email}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={user.password}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={user.confirmPassword}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm p-2 w-full"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add User
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddUserForm;
