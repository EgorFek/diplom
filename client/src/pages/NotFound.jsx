import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#EFF1ED]">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Ошибка 404</h1>
      <p className="text-lg text-gray-600 mb-8">
        Запрашиваемая страница не найдена.
      </p>
      <Link to="/" className="text-[#344966] hover:underline">
        Вернуться на главную
      </Link>
    </div>
  );
};
