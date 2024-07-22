import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import axios from "axios";
import { TableLine } from "./sections/TableLine";

export const AdminUsers = () => {
  //Получение пользователей
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/user");
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [["users"]],
    queryFn: getUsers,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[90vh] bg-[#EFF1ED] flex justify-center items-center">
      <div className="container mx-auto p-2 table-container max-h-[800px] overflow-y-auto">
        <table className="min-w-full overflow-x-auto">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Имя
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Фамилия
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Пароль
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Статус
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Изменить статус
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Удалить
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user, index) => (
              <TableLine key={index} user={user} refetch={refetch} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
