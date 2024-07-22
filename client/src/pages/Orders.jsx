import axios from "axios";
import { Order } from "./sections/Order";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "./Loading";
import { Link } from "react-router-dom";

export const Orders = () => {
  axios.defaults.withCredentials = true;

  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/order");
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const {
    data: orders,
    isLodaing,
    refetch,
  } = useQuery({
    queryKey: [["orders"]],
    queryFn: getOrders,
  });

  if (isLodaing) {
    return <Loading />;
  }

  console.log(orders);

  return (
    <div className="bg-[#EFF1ED] min-h-[90vh] p-2">
      <div className="container mx-auto text-black flex flex-col gap-[40px]">
        <Link
          to="/create/order"
          className="shadow-md rounded p-2 text-center bg-[#5B7553] text-white mt-4"
        >
          Создать новый заказ
        </Link>
        <div className="min-h-[70vh] flex items-center">
          <div className="overflow-y-auto max-h-[700px] flex flex-col gap-[10px] rounded">
            {orders?.map((order, index) => (
              <Order key={index} order={order} refetch={refetch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
