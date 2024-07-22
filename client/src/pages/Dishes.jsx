import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Dish } from "./sections/Dish";
import { Loading } from "./Loading";

export const Dishes = () => {
  axios.defaults.withCredentials = true;

  const [searchDishName, setSearchDishName] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(0);

  const [order, setOrder] = useState("DESC");

  const handleSearchInputChange = (event) => {
    setSearchDishName(event.target.value);
  };

  const getDishes = async (dishName, categoryId) => {
    try {
      dishName = typeof dishName === "string" ? dishName : "";
      const response = await axios.get("http://localhost:3001/api/v1/dish", {
        params: {
          dishName: dishName,
          categoryId: categoryId,
          orderBy: order,
        },
      });
      const responseData = response.data;
      const dishes = responseData.data;
      return dishes;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getCategories = async (categoryName) => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/category");
      const responseData = response.data;
      const categories = responseData.data;
      return categories;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    data: dishes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [["dishes"]],
    queryFn: () => getDishes(searchDishName, selectedCategory),
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: [["categories"]],
    queryFn: getCategories,
  });

  if (isLoading && isCategoriesLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[90vh] bg-[#EFF1ED]">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-[20px] p-2">
          <div>
            <div className="mb-2">
              <label htmlFor="name" className="text-lg">
                Название блюда
              </label>
              <input
                type="text"
                placeholder="Название блюда..."
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="category" className="text-lg">
                Кaтегория блюд
              </label>
              <div className="flex gap-[20px] justify-center items-center">
                <select
                  name="category"
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  onChange={(event) => {
                    setSelectedCategory(event.target.value);
                  }}
                >
                  <option value={0}>Все</option>
                  {categories?.map((category, index) => (
                    <option value={category.id}>{category.category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="order" className="text-lg">
                Кaтегория блюд
              </label>
              <div className="flex gap-[20px] justify-center items-center">
                <select
                  name="order"
                  id="order"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  onChange={(event) => {
                    setOrder(event.target.value);
                  }}
                >
                  <option value="DESC">От новых к старым</option>
                  <option value="ASC">От старым к новых</option>
                </select>
              </div>
            </div>
            <button
              className="bg-[#0D1821] p-2 text-white rounded-xl w-full"
              onClick={refetch}
            >
              Найти
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 col-span-3 gap-4 py-2">
            {dishes?.length > 0 ? (
              dishes?.map((dish, index) => {
                return (
                  <Dish
                    key={index}
                    img={dish.imageName}
                    name={dish.name}
                    price={dish.price}
                    description={dish.description}
                    category={dish.DishCategory.category}
                  />
                );
              })
            ) : (
              <div className="bg-white p-2 shadow-md col-span-full rounded flex justify-center items-center">
                Блюдо не найдено
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
