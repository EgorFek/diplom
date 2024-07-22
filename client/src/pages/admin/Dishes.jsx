import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, createContext } from "react";
import { Loading } from "../Loading";
import { DishForm } from "./sections/DishForm";
import { AdminDish } from "./sections/Dish";

export const AdminDishContext = createContext();

export const AdminDishes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dishId, setDishId] = useState(-1);

  const [dish, setDish] = useState(null);

  const [searchDishName, setSearchDishName] = useState("");

  const [formError, setFormError] = useState("");

  //Изменение значения строки поиска
  const handleSearchInputChange = (event) => {
    setSearchDishName(event.target.value);
  };

  //Получение всех блюд
  const getDishes = async (dishName) => {
    try {
      dishName = typeof dishName === "string" ? dishName : "";
      const response = await axios.get("http://localhost:3001/api/v1/dish", {
        params: {
          dishName: dishName,
        },
      });
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const {
    data: dishes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [["dishes"]],
    queryFn: () => getDishes(searchDishName),
  });

  //Добавление блюда
  const addNewDish = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image[0]);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    try {
      await axios.post("http://localhost:3001/api/v1/dish", formData);
      refetch();
      closeModal();
    } catch (err) {
      setFormError(err.response.data.msg);
    }
  };

  //Изменение блюда
  const editDish = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image[0]);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    console.log(`http://localhost:3001/api/v1/dish/${dishId}`);

    try {
      await axios.put(`http://localhost:3001/api/v1/dish/${dishId}`, formData);
      refetch();
      closeModal();
    } catch (err) {
      setFormError(err.response.data.msg);
    }
  };

  const openModal = () => {
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setDishId(-1);
    setDish(null);
    openModal();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AdminDishContext.Provider value={{ dishId, dish, setDishId, setDish }}>
      <div className="min-h-[90vh] bg-[#EFF1ED] p-2">
        <div className="container mx-auto">
          <button
            className="shadow-md rounded p-2 text-center bg-[#5B7553] text-white mb-4 w-[100%]"
            onClick={openCreateModal}
          >
            Добавить новое блюдо
          </button>
          {isModalOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50"
              style={{ zIndex: 2 }}
            >
              <div className="bg-white p-1 rounded shadow-md">
                <button
                  className="w-full bg-[#0D1821] text-white p-1 rounded mb-3"
                  onClick={closeModal}
                >
                  Закрыть
                </button>
                <DishForm
                  onSubmit={dishId === -1 ? addNewDish : editDish}
                  formError={formError}
                  refetch={refetch}
                />
              </div>
            </div>
          )}
          <div className="p-4 flex gap-[20px]">
            <input
              type="text"
              placeholder="Название блюда..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleSearchInputChange}
            />
            <button
              className="bg-[#0D1821] p-2 text-white rounded-xl w-[200px]"
              onClick={() => {
                refetch();
              }}
            >
              Найти
            </button>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[900px] p-2">
            {dishes.length > 0 ? (
              dishes?.map((dish, index) => (
                <AdminDish
                  key={index}
                  id={dish.id}
                  name={dish.name}
                  image={dish.imageName}
                  description={dish.description}
                  price={dish.price}
                  categoryId={dish.DishCategoryId}
                  category={dish.DishCategory.category}
                  editDish={openModal}
                  refetch={refetch}
                />
              ))
            ) : (
              <div className="w-[100%] bg-white shadow-md text-center p-2">
                Блюдо не найдено
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDishContext.Provider>
  );
};
