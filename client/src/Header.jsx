import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "./App";
import userIcon from "./assets/userIcon.png";

export const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuth, user } = useContext(AppContext);

  const location = useLocation();

  if (location.pathname !== "/login" && location.pathname !== "/register") {
    props.setPrev(location.pathname);
    console.log(location.pathname);
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinkStyle = "text-gray-900 px-3 py-2 rounded-md text-sm font-medium";
  const navLinkStyleMobile =
    "text-gray-900 px-3 py-2 rounded-md text-sm font-medium block";

  return (
    <header>
      <nav className="bg-white">
        <div className="container mx-auto p-1">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div>
                <Link to="/" className="flex items-center gap-[10px]">
                  <img src="/logo.svg" alt="logo" className="w-10" />{" "}
                  <span className="font-medium">L'Art Culinaire</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline">
                  <Link to="/about" className={navLinkStyle}>
                    О нас
                  </Link>
                  <Link to="/dishes" className={navLinkStyle}>
                    Блюда
                  </Link>
                  <Link to="/contacts" className={navLinkStyle}>
                    Контакты
                  </Link>
                  {user?.UserStatusId === 2 && (
                    <Link
                      to="/admin"
                      className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex gap-[5px] items-center"
                    >
                      Админ панель
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="flex">
              {isAuth ? (
                <div className="flex gap-[10px]">
                  <Link
                    to="/profile"
                    className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex gap-[5px] items-center"
                  >
                    <img src={userIcon} alt="" style={{ width: "32px" }} />
                    Личный кабинет
                  </Link>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="px-4 py-3 text-sm font-medium rounded-md bg-[#344966] text-white"
                  >
                    Войти
                  </Link>
                </div>
              )}
              <div className="flex md:hidden ml-4">
                <button
                  onClick={toggleMenu}
                  type="button"
                  className="text-gray-900 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/about" className={navLinkStyleMobile}>
                О нас
              </Link>
              <Link to="/dishes" className={navLinkStyleMobile}>
                Блюда
              </Link>
              <Link to="/contacts" className={navLinkStyleMobile}>
                Контакты
              </Link>
              {user?.UserStatusId === 2 && (
                <Link
                  to="/admin"
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex gap-[5px] items-center"
                >
                  Админ панель
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
