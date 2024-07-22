import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loading } from "./Loading";
import { DishForOrder } from "./sections/DishForOrder";
import { OrderTable } from "./sections/OrderTable";
import { useState, useEffect } from "react";
import { GetedOrderDishes } from "./sections/GetedOrderDishes";
import { ReservationForm } from "./sections/ReservationForm";
import { GetedOrderTables } from "./sections/GetedOrderTables";
import { useNavigate } from "react-router-dom";

export const CreateOrder = () => {
  const [orderDishes, setOrderDishes] = useState([]);
  const [orderTables, setOrderTables] = useState([]);

  const [orderCreationError, setOrderCreationError] = useState("");

  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);

  const [tableId, setTableId] = useState(0);
  const [tableNumber, setTableNumber] = useState(0);

  const navigate = useNavigate();

  const getDishes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/dish");
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const getTables = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/table");
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const getOrderDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/session/order"
      );
      const responseData = response.data;
      return responseData.order;
    } catch (err) {
      return [];
    }
  };

  const { data: dishes, isLoading: isDishesLoading } = useQuery({
    queryKey: [["dishes"]],
    queryFn: getDishes,
  });

  const { data: tables, isLoading: isTablesLoading } = useQuery({
    queryKey: [["tables"]],
    queryFn: getTables,
  });

  const {
    data: order,
    isLoading: isOrderLoading,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: [["order"]],
    queryFn: getOrderDetails,
  });

  const createOrder = async () => {
    if (order.tables.length < 1 && order.dishes.length < 1) {
      setOrderCreationError("Нельзя создать пустой заказ");
      return;
    }

    if (order.tables.length < 1) {
      setOrderCreationError(
        "В заказе должен присутствовать как минимум один столик"
      );
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/v1/order");
    } catch (err) {
      setOrderCreationError("Ошибка сервера, поробуйте позднее");
      return;
    }

    setOrderCreationError("");
    navigate("/orders");
  };

  useEffect(() => {
    setOrderDishes(order?.dishes || []);
    setOrderTables(order?.tables || []);
  }, [order]);

  const openForm = () => {
    setIsReservationFormOpen(true);
  };
  const closeForm = () => {
    setIsReservationFormOpen(false);
  };

  if (isDishesLoading || isOrderLoading || isTablesLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#EFF1ED] min-h-[90vh] p-2">
      <div className="container mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Заказ:</h2>
          <div className="overflow-y-auto max-h-[600px] flex flex-col gap-[10px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {orderDishes.length > 0 ? (
                orderDishes?.map((dish, index) => (
                  <GetedOrderDishes
                    key={index}
                    dishId={dish.dish.id}
                    image={dish.dish.imageName}
                    name={dish.dish.name}
                    price={dish.dish.price}
                    quantity={dish.quantity}
                    refetchOrder={refetchOrder}
                  />
                ))
              ) : (
                <div className="px-2 py-3 bg-white rounded shadow-md col-span-full">
                  В вашем заказе нет блюд
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {orderTables.length > 0 ? (
                orderTables?.map((table, index) => (
                  <GetedOrderTables
                    key={index}
                    tableId={table.table.id}
                    number={table.table.number}
                    image={table.table.image}
                    capacity={table.table.capacity}
                    date={table.reservation}
                    refetchOrder={refetchOrder}
                  />
                ))
              ) : (
                <div className="px-2 py-3 bg-white rounded shadow-md col-span-full">
                  В вашем заказе нет столиков
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          className="w-[100%] p-2 bg-[#5B7553] text-white rounded"
          onClick={createOrder}
        >
          Создать заказ
        </button>
        {orderCreationError && (
          <div className="text-center p-2 text-[#780C00]">
            {orderCreationError}
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Блюда</h2>
          <div className="overflow-y-auto max-h-[600px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {dishes.map((dish) => (
                <DishForOrder
                  key={dish.id}
                  dishId={dish.id}
                  image={dish.imageName}
                  name={dish.name}
                  price={dish.price}
                  refetchOrder={refetchOrder}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Столики:</h2>
          <div className="overflow-y-auto max-h-[600px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {tables?.map((table, index) => (
                <OrderTable
                  key={index}
                  id={table.id}
                  number={table.number}
                  image={table.image}
                  capacity={table.capacity}
                  setTableId={setTableId}
                  setTableNumber={setTableNumber}
                  openForm={openForm}
                />
              ))}
            </div>
          </div>
          {isReservationFormOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50"
              style={{ zIndex: 2 }}
            >
              <div className="bg-white p-4 rounded shadow-md">
                <button
                  className="w-full bg-[#0D1821] text-white p-2 rounded mb-3"
                  onClick={closeForm}
                >
                  Закрыть
                </button>
                <ReservationForm
                  tableId={tableId}
                  tableNumber={tableNumber}
                  refetchOrder={refetchOrder}
                  closeForm={closeForm}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
