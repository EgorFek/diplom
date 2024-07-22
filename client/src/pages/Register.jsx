import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Некорректный адрес электронной почты")
    .required("Email обязателен для заполнения"),
  password: yup.string().required("Пароль обязателен для заполнения"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Пароли должны совпадать")
    .required("Подтвердите пароль"),
  name: yup.string().required("Имя обязательно для заполнения"),
  surname: yup.string().required("Фамилия обязательна для заполнения"),
});

export const Register = (props) => {
  axios.defaults.withCredentials = true;

  const navigator = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/register",
        data
      );
      if (response.data.success) {
        setErrorMessage("");
        await props.checkAuth();
        return navigator("/");
      } else {
        setErrorMessage(response.data.msg);
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFF1ED] p-4">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Регистрация</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm">
              Почта
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm">
              Подтвердите пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm">
              Имя
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="surname" className="block mb-2 text-sm">
              Фамилия
            </label>
            <input
              type="text"
              id="surname"
              {...register("surname")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.surname && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.surname.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#344966] text-white py-2 px-4 rounded-md focus:outline-none"
          >
            Зарегистрироваться
          </button>
          {errorMessage && (
            <p className="text-red-500 mt-1 text-center">{errorMessage}</p>
          )}
          <Link
            className="block text-center my-[10px] text-[#344966] text-sm"
            to="/login"
          >
            Уже есть аккаунт? Войти
          </Link>
        </form>
      </div>
    </div>
  );
};
