import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import backgroundImage from "../assets/background.jpg";

export const Main = () => {
  const { user } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center justify-center bg-[#EFF1ED]">
      <div
        className="flex items-center bg-cover text-white"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          minHeight: "80vh",
          minWidth: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="px-4 py-8 text-center flex flex-col w-[100%] sm:w-[75%] lg:w-[50%] ml-auto items-center gap-[40px]">
          <h1 className="text-3xl font-bold">
            {user
              ? `${user.name} ${user.surname}, добро пожаловать в ресторан "L'Art Culinaire"!`
              : 'Добро пожаловать в ресторан "L\'Art Culinaire"!'}
          </h1>
          <p
            className={`text-lg mx-auto ${
              window.innerWidth < 900 ? "w-auto" : "w-[50%]"
            }`}
          >
            Мы с гордостью предлагаем вам лучшие кулинарные блюда в городе.
            Будучи в бизнесе уже много лет, мы стремимся обеспечить вас
            непревзойденным опытом обслуживания и вкусом каждого блюда.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 text-white z-10 text-center">
        <div className="flex flex-col gap-[50px]">
          <div
            style={{
              minHeight: "20vh",
              width: window.innerWidth < 900 ? "100%" : "60%",
            }}
            className="bg-white p-6 rounded-lg flex flex-col sm:flex-row items-center justify-around shadow-md mx-auto"
          >
            <div className="sm:w-[60%]">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Наше меню
              </h2>
              <p className="mb-4 text-black">
                У нас вы найдете богатый выбор блюд для любого вкуса и случая.
                Ознакомьтесь с нашим меню и выберите то, что будет идеально
                подходить вам.
              </p>
            </div>
            <Link
              to="/dishes"
              className="w-100 p-2 bg-[#344966] rounded text-[#fff]"
            >
              Перейти к меню
            </Link>
          </div>
          {user && (
            <div
              style={{
                minHeight: "20vh",
                width: window.innerWidth < 900 ? "100%" : "60%",
              }}
              className="bg-white p-6 rounded-lg flex flex-col sm:flex-row items-center justify-around shadow-md mx-auto"
            >
              <div className="sm:w-[60%]">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Создание заказов
                </h2>
                <p className="mb-4 text-black">
                  Теперь вы можете создавать заказы прямо через наш сайт! Просто
                  выберите блюда из нашего меню, добавьте их в корзину и
                  оформите заказ.
                </p>
              </div>
              <Link
                to="/create/order"
                className="w-100 p-2 bg-[#344966] rounded text-[#fff]"
              >
                Создать заказ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
