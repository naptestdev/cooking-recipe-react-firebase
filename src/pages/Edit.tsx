import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAtomValue } from "jotai";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { db, storage } from "../service/firebase";
import { imageProxy } from "../service/image";
import { userAtom } from "../store";

const Edit: FC = () => {
  const navigate = useNavigate();

  const user = useAtomValue(userAtom);

  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const docSnap = await getDoc(doc(db, "recipes", id!));

      if (docSnap.exists()) {
        setData({
          ...docSnap.data(),
          id: docSnap.id,
          imageBlob: await (
            await fetch(imageProxy(docSnap.data().image))
          ).blob(),
        });
      } else {
        setError(true);
      }
    })();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const storageRef = ref(
      storage,
      `${Math.random().toString(32).slice(2)}/${data.image.name}`
    );
    await uploadBytes(storageRef, data.image);

    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "recipes", id!), {
      title: data.title.trim(),
      ingredients: data.ingredients.trim().replace(/\n+/g, "\n"),
      instructions: data.instructions.trim().replace(/\n+/g, "\n"),
      image: url,
    });

    navigate(`/recipe/${id}`);
  };

  if (error) return <div>Error</div>;

  if (!data)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow flex justify-center items-center">
          <div className="h-8 w-8 rounded-full border-[3px] border-sky-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );

  if (data.createdBy !== user?.uid) return <div>Access denied</div>;

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
                    Update existing recipes
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <Editor
                  onSubmit={onSubmit}
                  submitButtonTitle="Update"
                  defaultFormValue={{
                    title: data.title,
                    ingredients: data.ingredients,
                    instructions: data.instructions,
                    image: data.imageBlob,
                  }}
                  defaultImageUrl={data.image}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
