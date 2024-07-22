import axios from "axios";

export const Order = (props) => {
  const { order } = props;

  const cancelOrder = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/v1/order/${order.order.id}/cancel`
      );
    } catch (err) {}

    props.refetch();
  };

  const orderStatus = order.order.OrderStatus.status;
  const orderCreationTime = order.order.orderedAt;

  return (
    <div className="bg-white shadow-md rounded p-2 flex flex-col gap-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 w-[100%] gap-[10px]">
        <div className="overflow-y-auto max-h-[300px]">
          <h3 className="font-semibold">Блюда:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center gap-[10px]">
            {order.dishes.map((dish) => (
              <div key={dish.dish.id} className="rounded relative">
                <div className="flex justify-center">
                  <img
                    src={`/images/${dish.dish.imageName}`}
                    alt={dish.dish.name}
                  />
                </div>
                <div className="text-xl sm:text-base">
                  <span>{dish.dish.name}</span>
                </div>
                <div className="absolute top-0 right-1 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded">
                  {dish.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto max-h-[300px]">
          <h3 className="font-semibold">Столики:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
            {order.tables.map((tableReservation) => (
              <div key={tableReservation.table.id} className="rounded relative">
                <div className="flex justify-center">
                  <img
                    src={`/images/${tableReservation.table.image}`}
                    alt={`Стол ${tableReservation.table.number}`}
                    className="w-32 mr-2 rounded"
                  />
                </div>
                <div className="text-xl sm:text-base text-center">
                  {new Date(tableReservation.reservation).toLocaleString()}
                </div>
                <div className="absolute top-0 right-1 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded">
                  Стол {tableReservation.table.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-[20px] sm:items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="bg-[#344966] px-2 py-1 text-white rounded">
            {orderStatus}
          </div>
          <div>
            Дата создания заказа: {new Date(orderCreationTime).toLocaleString()}
          </div>
        </div>
        {order.order.OrderStatusId < 3 && (
          <button
            className="bg-[#780C00] p-2 text-white rounded"
            onClick={cancelOrder}
          >
            Отменить
          </button>
        )}
      </div>
    </div>
  );
};
