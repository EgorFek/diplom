import { useContext } from "react";
import { AdminDishContext } from "../Dishes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import axios from "axios";
import { Loading } from "../../Loading";

export const DishForm = (props) => {
  const { dish, dishId } = useContext(AdminDishContext);

  const schema = yup.object().shape({
    name: yup.string().required("Название обязательно для заполнения"),
    ...(dishId === -1 && {
      image: yup
        .mixed()
        .test(
          "fileRequired",
          "Изображение обязательно для загрузки",
          (value) => {
            return !!value && value.length > 0;
          }
        ),
    }),
    description: yup
      .string()
      .max(500, "Максимальное число символов - 500")
      .required("Описание обязательно для заполнения"),
    price: yup
      .number()
      .typeError("Цена должна быть числом")
      .required("Цена обязательна для заполнения")
      .positive("Цена должна быть положительным числом")
      .test(
        "decimal",
        "Цена должна быть числом с двумя цифрами после запятой",
        (value) => {
          if (!value) return true; // Разрешить пустое значение
          return /^\d+(\.\d{1,2})?$/.test(value); // Проверить формат числа с двумя цифрами после запятой
        }
      ),
    category: yup.number().required("Категория обязательна"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getCategories = async () => {
    try {
      const categories = await axios.get(
        "http://localhost:3001/api/v1/category"
      );
      const categoriesData = categories.data;
      return categoriesData.data;
    } catch (err) {
      return [];
    }
  };

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: [["categories"]],
    queryFn: getCategories,
  });

  if (isLoadingCategories) {
    return <Loading />;
  }

  const inputStyles = "border border-gray-300 rounded-md px-3 py-1 w-full";

  return (
    <div className="bg-white p-3 rounded shadow-md w-full sm:w-96">
      <h1 className="text-lg font-bold mb-4 text-center">
        Форма {dishId === -1 ? "создания" : "изменения"} блюда
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            * Название блюда:
          </label>
          <input
            type="text"
            id="name"
            defaultValue={dish?.name}
            {...register("name")}
            className={inputStyles}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold mb-1">
            {dishId === -1 && "*"} Изображение:
          </label>
          <input
            type="file"
            id="image"
            {...register("image")}
            className={inputStyles}
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-1"
          >
            * Описание:
          </label>
          <textarea
            id="description"
            {...register("description")}
            defaultValue={dish?.description}
            className={inputStyles}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-semibold mb-1">
            * Цена:
          </label>
          <input
            type="text"
            id="price"
            defaultValue={dish?.price}
            {...register("price")}
            className={inputStyles}
            min="1"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-semibold mb-1"
          >
            * Категория блюда:
          </label>
          <select
            id="category"
            className={
              inputStyles + " focus:outline-none focus:border-blue-500"
            }
            defaultValue={dish?.categoryId}
            {...register("category")}
          >
            {categories?.map((category, index) => (
              <option key={index} value={category.id} className="text-gray-900">
                {category.category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#5B7553] w-[100%] text-white py-2 px-4 rounded-md"
        >
          {dishId === -1 ? "Создать" : "Изменить"}
        </button>
        {props.formError && (
          <div className="w-100 text-center text-[#780c00]">
            {props.formError}
          </div>
        )}
      </form>
    </div>
  );
};
