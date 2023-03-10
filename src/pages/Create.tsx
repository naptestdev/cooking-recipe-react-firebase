import { useAtomValue } from "jotai";
import { FC, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { userAtom } from "../store";
import { db, storage } from "../service/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Editor from "../components/Editor";

const Create: FC = () => {
  const navigate = useNavigate();

  const user = useAtomValue(userAtom);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const storageRef = ref(
      storage,
      `${Math.random().toString(32).slice(2)}/${data.image.name}`
    );
    await uploadBytes(storageRef, data.image);

    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "recipes"), {
      title: data.title.trim(),
      ingredients: data.ingredients.trim().replace(/\n+/g, "\n"),
      instructions: data.instructions.trim().replace(/\n+/g, "\n"),
      image: url,
      createdAt: serverTimestamp(),
      createdBy: user?.uid,
      likes: [],
    });

    navigate("/");
  };

  if (!user) return <Navigate to="/sign-in" />;

  return (
    <>
      <Navbar />

      {isLoading && (
        <div className="fixed inset-0 w-screen h-screen bg-[#00000080] flex justify-center items-center z-10">
          <div className="h-8 w-8 rounded-full border-[3px] border-sky-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      <div className="flex justify-center mx-4 py-3">
        <div className="w-full max-w-[1200px]">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Create new recipes
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <Editor onSubmit={onSubmit} submitButtonTitle="Create" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
