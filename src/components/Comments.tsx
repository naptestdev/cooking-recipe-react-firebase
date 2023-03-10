import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FC, FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { db } from "../service/firebase";
import { useAtomValue } from "jotai";
import { userAtom } from "../store";
import { imageProxy } from "../service/image";

const Comments: FC = () => {
  const user = useAtomValue(userAtom);

  const { id } = useParams();

  const [data, setData] = useState<null | any[]>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "recipes", id!, "comments"),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        let raw: any[] = [];
        snapshot.forEach((item) => raw.push({ ...item.data(), id: item.id }));
        setData(raw);
      }
    );

    return () => unsub();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setInputValue("");

    addDoc(collection(db, "recipes", id!, "comments"), {
      content: inputValue.trim(),
      uid: user?.uid,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-3 my-5">
      <h2 className="text-lg font-bold">Comments</h2>
      <form onSubmit={handleSubmit} className="relative rounded-md shadow-sm">
        <input
          disabled={!user}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          type="text"
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Type what you think..."
        />
        <button
          disabled={!user}
          className="text-indigo-600 absolute top-1/2 right-2 -translate-y-1/2"
        >
          <IoSend />
        </button>
      </form>

      <p>{data?.length} comments</p>

      {data?.map((item) => (
        <div className="flex gap-2">
          <img
            className="w-10 h-10 rounded-full"
            src={imageProxy(item.photoURL)}
            alt=""
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{item.displayName}</h3>
            <p className="whitespace-pre-wrap break-words">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
