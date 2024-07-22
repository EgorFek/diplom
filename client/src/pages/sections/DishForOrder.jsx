import axios from "axios";

export const DishForOrder = (props) => {
  const addDishToOrder = async () => {
    try {
      await axios.get("http://localhost:3001/api/v1/session/order/addDish", {
        params: { dishId: props.dishId },
      });
      props.refetchOrder();
    } catch (err) {
      console.log("Не удалось добавить блюдо в заказ");
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
      onClick={addDishToOrder}
    >
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
      <div className="p-4 flex justify-between items-center">
        <h5 className="text-xl font-semibold">{props.name}</h5>
      </div>
    </div>
  );
};
