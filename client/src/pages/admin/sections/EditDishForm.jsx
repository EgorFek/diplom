import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import axios from "axios";
import { Loading } from "../../Loading";

export const EditDishForm = (props) => {
  const schema = yup.object().shape({
    name: yup.string().required("Название обязательно для заполнения"),
    description: yup.string().required("Описание обязательно для заполнения"),
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

  const { data: categories, isLoading } = useQuery({
    queryKey: [["categories"]],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (isLoading) {
    return <Loading />;
  }

  console.log(categories);

  return (
    <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Форма создания блюда
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Название блюда:
          </label>
          <input
            type="text"
            id="name"
            defaultValue={props?.name}
            {...register("name")}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold mb-1">
            Изображение:
          </label>
          <input
            type="file"
            id="image"
            {...register("image")}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
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
            Описание:
          </label>
          <textarea
            id="description"
            {...register("description")}
            defaultValue={props?.description}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-semibold mb-1">
            Цена:
          </label>
          <input
            type="text"
            id="price"
            defaultValue={props?.price}
            {...register("price")}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
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
            Категория блюда:
          </label>
          <select
            id="category"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            defaultValue={props?.category}
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
          Создать
        </button>
      </form>
    </div>
  );
};
