import { useAtomValue } from "jotai";
import { FC } from "react";
import { Link } from "react-router-dom";
import { userAtom } from "../store";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../service/firebase";
import { imageProxy } from "../service/image";

const Navbar: FC = () => {
  const user = useAtomValue(userAtom);

  return (
    <div className="flex justify-center mx-4 py-5 border-b">
      <div className="w-full max-w-[1200px] flex justify-between items-center">
        <div>
          <Link to="/" className="text-2xl">
            Cooking Recipe
          </Link>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full"
                src={imageProxy(user.photoURL!)}
                alt=""
              />
              <span>{user.displayName}</span>
              <button onClick={() => signOut(auth)}>
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link
              className="text-lg text-sky-500 flex items-center gap-2"
              to="/sign-in"
            >
              <FaSignInAlt />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
