import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Некорректный адрес электронной почты")
    .required("Email обязателен для заполнения"),
  password: yup.string().required("Пароль обязателен для заполнения"),
});

export const Login = (props) => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

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
        "http://localhost:3001/api/v1/user/login",
        data
      );
      if (response.data.success) {
        setErrorMessage("");
        await props.checkAuth();
        return navigate(props.navigateTo);
      } else {
        setErrorMessage(response.data.msg);
      }
    } catch (error) {
      setErrorMessage(error.response.data.msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFF1ED] px-1 py-1">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Вход в аккаунт</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Почта
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#344966] text-white py-2 px-4 rounded-md focus:outline-none"
          >
            Войти
          </button>
          {errorMessage && (
            <p className="text-red-500 mt-1 text-center">{errorMessage}</p>
          )}
          <Link
            className="block text-center my-[10px] text-[#344966]"
            to="/register"
          >
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </form>
      </div>
    </div>
  );
};
