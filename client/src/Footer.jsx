import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 font-semibold py-4">
      <div className="container mx-auto px-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <Link to="/" className="flex items-center gap-[10px]">
              <img src="/logo.svg" alt="logo" className="w-10" />{" "}
              <span className="font-medium">L'Art Culinaire</span>
            </Link>
          </div>
          <div className="mb-4 md:mb-0">
            <p className="text-center">
              © 2024 Ресторан "L'Art Culinaire". Все права защищены.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Link
                to="/about"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium text-center"
              >
                О нас
              </Link>
              <Link
                to="/dishes"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium text-center"
              >
                Блюда
              </Link>
              <Link
                to="/contacts"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium text-center"
              >
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
