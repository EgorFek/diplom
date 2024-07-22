import { useState } from "react";
import { Link } from "react-router-dom";

export const Dish = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      <div className="relative">
        <div
          className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
          onClick={toggleModal}
        >
          <div className="relative">
            <img
              src={`/images/${props.img}`}
              alt={props.name}
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded-full">
              {props.price} руб.
            </div>
          </div>
          <div className="p-4 flex flex-col gap-[3px] sm:min-h-[140px] md:min-h-[0px] justify-center">
            <h5 className="text-lg font-semibold text-center">{props.name}</h5>
            <span className="rounded-full text-center text-sm">
              {props.category}
            </span>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg overflow-hidden max-w-lg">
            <div className="relative">
              <img
                src={`/images/${props.img}`}
                alt={props.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded-full">
                {props.price} руб.
              </div>
              <button
                className="absolute top-2 right-2 text-white rounded bg-[#780C00] px-3 py-1"
                onClick={toggleModal}
              >
                X
              </button>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{props.name}</h2>
              <p className="text-sm mb-4">{props.description}</p>
              <Link
                to="/create/order"
                className="block w-full text-center bg-[#344966] text-white py-2 rounded-md"
                onClick={toggleModal}
              >
                Заказать
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
