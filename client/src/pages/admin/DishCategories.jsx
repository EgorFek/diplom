import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Loading } from "../Loading";
import { Category } from "./sections/Category";

export const DishCategories = () => {
  axios.defaults.withCredentials = true;
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creationError, setCreationError] = useState("");

  const handleCategoryInputCange = (event) => {
    setNewCategoryName(event.target.value);
  };

  //Получение категорий
  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/category");
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      console.log(err);
    }
  };

  //Создание категорий
  const createCategory = async () => {
    try {
      if (newCategoryName) {
        await axios.post("http://localhost:3001/api/v1/category", {
          categoryName: newCategoryName,
        });
        setCreationError("");
        refetch();
      } else {
        setCreationError("Поле не должно быть пустым");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [["categories"]],
    queryFn: getCategories,
  });

  if (isLoading) {
    return <Loading />;
  }

  console.log(categories);

  return (
    <div className="bg-[#EFF1ED] min-h-[90vh] flex justify-center items-center">
      <div className="container min-h-[50vh] rounded-xl p-2">
        <div className="mb-3 flex gap-[20px] w-[90%] xl:w-[60%] mx-auto mt-6">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Новая категория блюд..."
            onChange={handleCategoryInputCange}
          />
          <button
            className="bg-[#5B7553] p-2 text-white rounded-xl w-[200px]"
            onClick={createCategory}
          >
            Добавить
          </button>
        </div>
        <div className="text-center text-red-700">
          {creationError && creationError}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-[40px]">
          {categories?.map((category) => (
            <Category
              key={category.id}
              name={category.category}
              id={category.id}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
