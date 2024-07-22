import { useQuery } from "@tanstack/react-query";
import { useState, createContext } from "react";
import { TableForm } from "./sections/TableForm";
import axios from "axios";
import { Loading } from "../Loading";
import { AdminTable } from "./sections/AdminTable";

export const AdminTablesContext = createContext();

export const AdminTables = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tableId, setTableId] = useState(-1);

  const [tableData, setTableData] = useState(null);

  const [serverErrorMessage, setServerErrorMessage] = useState("");

  //Получение столиков
  const getTables = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/table");
      const responseData = response.data;
      return responseData.data;
    } catch (err) {
      return [];
    }
  };

  const {
    data: tables,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [["tables"]],
    queryFn: getTables,
  });

  //Открытие модального окна
  const openModal = () => {
    setServerErrorMessage("");
    setIsModalOpen(true);
  };

  //Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openNewTableForm = () => {
    setTableId(-1);
    setTableData(null);
    openModal();
  };

  if (isLoading) {
    return <Loading />;
  }

  //Создание столика
  const createTable = async (data) => {
    const formData = new FormData();
    formData.append("number", data.number);
    formData.append("image", data.image[0]);
    formData.append("capacity", data.capacity);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/table",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response.data;
      setServerErrorMessage(
        !responseData.success ? "Столик с таким названием уже существует" : ""
      );
      refetch();
      closeModal();
    } catch (err) {
      setServerErrorMessage(
        !err.response.data?.success ? err.response.data?.msg : ""
      );
    }
  };

  //Изменение столика
  const editTable = async (data) => {
    const formData = new FormData();
    formData.append("number", data.number);
    formData.append("image", data.image[0]);
    formData.append("capacity", data.capacity);
    console.log(tableId);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/v1/table/${tableId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response.data;
      setServerErrorMessage(
        !responseData.success ? "Столик с таким названием уже существует" : ""
      );
      refetch();
      closeModal();
    } catch (err) {
      setServerErrorMessage(
        !err.response.data?.success ? err.response.data?.msg : ""
      );
    }
  };

  //Задать изображение по умолчанию
  const setDefaultTableImage = async () => {
    try {
      await axios.put(`http://localhost:3001/api/v1/table/${tableId}/default`);
      refetch();
    } catch (err) {}
  };

  return (
    <AdminTablesContext.Provider
      value={{ tableId, tableData, setTableId, setTableData }}
    >
      <div className="min-h-[90vh] bg-[#EFF1ED] p-2">
        <div className="container mx-auto">
          <button
            className="shadow-md rounded p-2 text-center bg-[#5B7553] text-white mb-4 w-[100%]"
            onClick={openNewTableForm}
          >
            Добавить новый столик
          </button>
          {isModalOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50"
              style={{ zIndex: 2 }}
            >
              <div className="bg-white p-1 rounded shadow-md">
                <button
                  className="w-full bg-[#0D1821] text-white p-1 rounded mb-3"
                  onClick={closeModal}
                >
                  Закрыть
                </button>
                <TableForm
                  serverError={serverErrorMessage}
                  tableId={tableId}
                  onSubmit={tableId === -1 ? createTable : editTable}
                  setDefaultTableImage={setDefaultTableImage}
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[900px] p-2">
            {tables?.map((table_, index) => (
              <AdminTable
                key={index}
                id={table_.id}
                image={table_.image}
                number={table_.number}
                capacity={table_.capacity}
                openModal={openModal}
                refetch={refetch}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminTablesContext.Provider>
  );
};
