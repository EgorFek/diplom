import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdminTablesContext } from "../Tables";
import { useContext } from "react";
import * as yup from "yup";

export const TableForm = (props) => {
  const { tableData } = useContext(AdminTablesContext);

  const schema = yup.object().shape({
    number: yup.string().required("Название обязательно для заполнения"),
    capacity: yup
      .number("Вместимость должна быть")
      .typeError("Вместимость должна быть числом")
      .positive("Вместимость должна быть положительным числом"),
    image: yup.mixed(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputStyles = "border border-gray-300 rounded-md px-3 py-1 w-full";

  return (
    <div className="container">
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            * Название столика:
          </label>
          <input
            type="text"
            id="number"
            defaultValue={tableData?.number}
            {...register("number")}
            className={inputStyles}
          />
          {errors.number && (
            <p className="text-red-500">{errors.number?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="capacity"
            className="block text-sm font-semibold mb-1"
          >
            * Вместимость столика:
          </label>
          <input
            type="text"
            id="capacity"
            defaultValue={tableData?.capacity}
            {...register("capacity")}
            className={inputStyles}
          />
          {errors.capacity && (
            <p className="text-red-500">{errors.capacity?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold mb-1">
            Изображение столика:
          </label>
          <div className="flex items-center gap-[10px]">
            <input
              type="file"
              id="image"
              {...register("image")}
              className={inputStyles}
            />
            {props.tableId !== -1 && (
              <button
                type="submit"
                className="bg-[#0D1821] w-[60%] text-white mt-1 py-2 px-4 rounded-md"
                onClick={props.setDefaultTableImage}
              >
                Изображение по умолчанию
              </button>
            )}
          </div>
          {errors.name && (
            <p className="text-red-500">{errors.image?.message}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#5B7553] w-[100%] text-white py-2 px-4 rounded-md"
          >
            {props.tableId === -1 ? "Создать" : "Изменить"}
          </button>
        </div>
        {props.serverError && (
          <div className="text-red-400 text-center">{props.serverError}</div>
        )}
      </form>
    </div>
  );
};
