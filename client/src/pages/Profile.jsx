import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "../App";
import { Link } from "react-router-dom";
import axios from "axios";
import userIcon from "../assets/userIcon.png";
import orderIcon from "../assets/orderIcon.png";
import editIcon from "../assets/editIcon.png";

export const Profile = (props) => {
  axios.defaults.withCredentials = true;

  const { user, setIsAuth, setUser } = useContext(AppContext);
  const [isEditingData, setIsEditingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const cardClasses =
    "bg-white shadow-md rounded-lg overflow-hidden min-h-[210px] min-w-[380px]";

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/api/v1/user",
        data
      );
      if (!response.data.success) {
        setErrorMessage(response.data.msg);
      }
      await props.changeData();
      setIsEditingData(false);
    } catch (err) {
      setErrorMessage(err.response.data.msg);
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:3001/api/v1/user/logout");
      await props.changeData();
      setIsAuth(false);
      setUser(null);
    } catch (err) {
      console.log(err.response.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen gap-[20px] bg-[#EFF1ED] p-2">
      <div className={cardClasses + " mb-4 md:mb-0"}>
        {isEditingData ? (
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4">
              <div className="flex items-center justify-center">
                <img
                  src={userIcon}
                  alt="User Icon"
                  className="w-24 h-24 rounded-full"
                />
                <div className="ml-4">
                  <div className="mb-1 flex gap-[19px]">
                    <input
                      type="text"
                      className={`border-b border-gray-400 w-[85px] ${
                        errors.name && "border-red-500"
                      }`}
                      placeholder="Имя"
                      defaultValue={user.name}
                      {...register("name", { required: true })}
                    />
                    <input
                      type="text"
                      className={`border-b border-gray-400 w-[85px] ${
                        errors.surname && "border-red-500"
                      }`}
                      placeholder="Фамилия"
                      defaultValue={user.surname}
                      {...register("surname", { required: true })}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className={`border-b border-gray-400 ${
                        errors.email && "border-red-500"
                      }`}
                      placeholder="Почта"
                      defaultValue={user.email}
                      {...register("email", {
                        required: true,
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Почта заполнена некорректно",
                        },
                      })}
                    />
                    {errorMessage && (
                      <p className="text-red-500 text-sm max-w-[200px]">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="self-start ml-auto mt-[10px]"
                  onClick={() => {
                    setIsEditingData(!isEditingData);
                  }}
                >
                  <img src={editIcon} alt="" className="w-[20px]" />
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-300">
              <button
                type="submit"
                className="bg-[#5B7553] text-white py-2 px-4 rounded-md w-full"
              >
                Сохранить
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="p-4">
              <div className="flex items-center justify-center">
                <img
                  src={userIcon}
                  alt="User Icon"
                  className="w-24 h-24 rounded-full"
                />
                <div className="ml-4">
                  <h1 className="text-xl font-semibold">
                    {user.name} {user.surname}
                  </h1>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  className="self-start ml-auto mt-[10px]"
                  onClick={() => {
                    setIsEditingData(!isEditingData);
                  }}
                >
                  <img src={editIcon} alt="" className="w-[20px]" />
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-300">
              <button
                className="bg-[#0D1821] text-white py-2 px-4 rounded-md w-full"
                onClick={logout}
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={cardClasses}>
        <div className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-center gap-[20px]">
            <img src={orderIcon} alt="Заказ" className="w-24" />
            <h1 className="text-xl font-semibold">Ваши заказы</h1>
          </div>
        </div>
        <div className="p-4 border-t border-gray-300">
          <p className="text-gray-500 mb-1">
            Создавайте заказы и они окажутся здесь
          </p>
          <Link
            to="/orders"
            className="text-[#344966] hover:underline text-center"
          >
            Посмотреть заказы
          </Link>
        </div>
      </div>
    </div>
  );
};
