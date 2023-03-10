import { onAuthStateChanged } from "firebase/auth";
import { useAtom } from "jotai";
import { FC, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import SignIn from "./pages/SignIn";
import { auth } from "./service/firebase";
import { userAtom } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "sign-in",
    element: <SignIn />,
  },
  {
    path: "create",
    element: <Create />,
  },
  {
    path: "recipe/:id",
    element: <Recipe />,
  },
  {
    path: "edit/:id",
    element: <Edit />,
  },
]);

const App: FC = () => {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
      } else {
        setUser(user);
      }
    });
  }, []);

  if (typeof user === "undefined")
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="h-8 w-8 rounded-full border-[3px] border-sky-500 border-t-transparent animate-spin"></div>
      </div>
    );

  return <RouterProvider router={router} />;
};

export default App;
