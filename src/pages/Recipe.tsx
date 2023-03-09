import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db } from "../service/firebase";
import { FaHeart } from "react-icons/fa";
import { useAtomValue } from "jotai";
import { userAtom } from "../store";
import Comments from "../components/Comments";

const Recipe: FC = () => {
  const user = useAtomValue(userAtom);

  const { id } = useParams();
  const [data, setData] = useState<null | any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "recipes", id!), (doc) => {
      setData({ ...doc.data(), id: doc.id });
    });

    return unsub;
  }, [id]);

  const toggleLike = async () => {
    if (data.likes.includes(user?.uid)) {
      await updateDoc(doc(db, "recipes", id!), {
        likes: arrayRemove(user?.uid),
      });
    } else {
      await updateDoc(doc(db, "recipes", id!), {
        likes: arrayUnion(user?.uid),
      });
    }
  };

  if (!data)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow flex justify-center items-center">
          <div className="h-8 w-8 rounded-full border-[3px] border-sky-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="flex justify-center mx-4 py-3">
        <div className="w-full max-w-[1200px]">
          <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex flex-col items-stretch">
              <div>
                <img className="w-full h-auto" src={data.image} alt="" />
              </div>
              <div>
                <h2 className="text-2xl font-bold my-3">Ingredients</h2>

                <p className="whitespace-pre-wrap break-words">
                  {data.ingredients}
                </p>
              </div>
            </div>
            <div className="md:w-[55vw] flex-shrink-0">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-bold">{data.title}</h1>
                <button
                  onClick={() => toggleLike()}
                  className={`flex items-center gap-1 rounded-full border px-2 ${
                    data.likes.includes(user?.uid) ? "border-red-600" : ""
                  }`}
                >
                  <FaHeart className="text-red-600" />
                  <span className="text-lg">{data.likes.length}</span>
                </button>
              </div>

              <h2 className="text-2xl font-bold my-3">Instructions</h2>

              <p className="whitespace-pre-wrap break-words">
                {data.instructions}
              </p>

              <Comments />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recipe;
