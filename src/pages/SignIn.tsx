import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAtomValue } from "jotai";
import { FC, useState } from "react";
import { auth } from "../service/firebase";
import { userAtom } from "../store";
import { Navigate } from "react-router-dom";

const SignIn: FC = () => {
  const user = useAtomValue(userAtom);

  const [isDisabled, setIsDisabled] = useState(false);

  const signInWithGoogle = async () => {
    setIsDisabled(true);
    await signInWithPopup(auth, new GoogleAuthProvider()).catch((err) => {
      console.log(err);
      alert(err.code);
    });
    setIsDisabled(false);
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5">
      <h1 className="text-3xl text-center">Sign in to continue</h1>
      <button
        disabled={isDisabled}
        onClick={() => signInWithGoogle()}
        className="flex bg-[#F7F7F7] shadow-md p-3 gap-4 rounded hover:brightness-[97%] disabled:brightness-[95%] disabled:shadow-none transition"
      >
        <img className="w-6 h-6" src="/google.png" alt="" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default SignIn;
