import axios from "axios";
import { AdminOrder } from "./sections/Order";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";

export const AdminOrders = () => {
  //Полчуение заказов
  const getOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/order/all"
      );
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [["orders"]],
    queryFn: getOrders,
  });

  if (isLoading || !orders) {
    return <Loading />;
  }

  console.log(orders);

  return (
    <div className="min-h-[90vh] flex items-center bg-[#EFF1ED] p-2">
      <div className="container mx-auto">
        <div className="overflow-y-auto max-h-[700px] flex flex-col gap-[10px] rounded">
          {!orders || orders.length > 0 ? (
            orders?.map((order, index) => (
              <AdminOrder key={index} order={order} refetch={refetch} />
            ))
          ) : (
            <div className="bg-white p-2 text-center shadow-md w-[100%]">
              Заказы не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
