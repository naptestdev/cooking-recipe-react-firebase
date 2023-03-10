import { FC, useState } from "react";
import { useForm } from "react-hook-form";

interface EditorProps {
  onSubmit: (data: any) => void;
  submitButtonTitle: string;
  defaultFormValue?: any;
  defaultImageUrl?: string;
}

const Editor: FC<EditorProps> = ({
  onSubmit,
  submitButtonTitle,
  defaultFormValue,
  defaultImageUrl,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    defaultImageUrl || null
  );

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaultFormValue || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2 flex rounded-md shadow-sm">
                <input
                  {...register("title", { required: true })}
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Sandwich"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Ingredients
            </label>
            <div className="mt-2">
              <textarea
                {...register("ingredients", { required: true })}
                id="ingredients"
                name="ingredients"
                rows={3}
                className="mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                placeholder={`1. Sugar\n2. Tomatoes\n3. Lettuce`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Instructions
            </label>
            <div className="mt-2">
              <textarea
                {...register("instructions")}
                id="instructions"
                name="instructions"
                rows={3}
                className="mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                placeholder={`1. Do something\n2. Do something else\n3. Et cetera`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Cover photo
            </label>
            <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className={"space-y-1 text-center"}>
                {selectedImage ? (
                  <div className="h-[140px] w-full flex justify-center items-center">
                    <img
                      className="h-[140px] w-auto"
                      src={selectedImage!}
                      alt=""
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>
                      {selectedImage ? "Change the file" : "Upload a file"}
                    </span>
                    <input
                      {...register("image", { required: true })}
                      type="text"
                      hidden
                      className="hidden"
                    />
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const url = URL.createObjectURL(e.target.files?.[0]);
                          setValue("image", e.target.files[0]);
                          setSelectedImage(url);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {submitButtonTitle}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Editor;
