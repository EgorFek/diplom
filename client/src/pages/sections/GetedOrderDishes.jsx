import axios from "axios";

export const GetedOrderDishes = (props) => {
  axios.defaults.withCredentials = true;

  //Увеличение количества блюда на единицу
  const handleDecrement = async () => {
    if (props.quantity > 1)
      try {
        await axios.put(
          "http://localhost:3001/api/v1/session/order/changeQuantity",
          { value: -1, dishId: props.dishId }
        );
        props.refetchOrder();
      } catch (err) {}
  };

  //Уменьшение количества блюда на единицу
  const handleIncrement = async () => {
    try {
      await axios.put(
        "http://localhost:3001/api/v1/session/order/changeQuantity",
        { value: 1, dishId: props.dishId }
      );
      props.refetchOrder();
    } catch (err) {}
  };

  //Удаление блюда из заказа
  const handleDelete = async () => {
    try {
      axios.delete("http://localhost:3001/api/v1/session/order/removeDish", {
        data: { dishId: props.dishId },
      });
      props.refetchOrder();
    } catch (err) {}
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer">
      <div className="relative">
        <img
          src={`/images/${props.image}`}
          alt={props.name}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded-full">
          {props.price} руб.
        </div>
      </div>
      <div className="p-4 flex flex-col gap-[10px] justify-between items-center">
        <h5 className="text-xl font-semibold">{props.name}</h5>
        <div className="flex items-center">
          <button
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md mr-2"
            onClick={handleDecrement}
          >
            -
          </button>
          <input
            type="number"
            min="0"
            value={props.quantity}
            onChange={() => {
              return 0;
            }}
            className="w-16 text-center"
          />
          <button
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md ml-2"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
        <button
          className="p-2 bg-[#780C00] rounded text-white"
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};
