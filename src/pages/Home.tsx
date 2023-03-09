import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db } from "../service/firebase";

const Home: FC = () => {
  const [data, setData] = useState<null | any[]>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "recipes"), orderBy("createdAt", "desc")),
      (snapshot) => {
        let raw: any[] = [];
        snapshot.forEach((item) => raw.push({ ...item.data(), id: item.id }));
        setData(raw);
      }
    );

    return () => unsub();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-center mx-4 py-3">
        <div className="w-full max-w-[1200px]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl">All Ingredients</h1>
            <Link
              to="/create"
              className="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
            >
              Create new
            </Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] my-5 gap-3">
            {data?.map((item) => (
              <Link
                to={`/recipe/${item.id}`}
                className="shadow rounded cursor-pointer"
                key={item.id}
              >
                <div className="w-full h-0 pb-[56.25%] relative">
                  <img
                    className="absolute h-full w-full inset-0"
                    src={item.image}
                    alt=""
                  />
                </div>
                <p className="text-xl font-semibold p-2">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
