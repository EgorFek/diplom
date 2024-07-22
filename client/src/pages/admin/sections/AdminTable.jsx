import axios from "axios";
import { AdminTablesContext } from "../Tables";
import { useContext } from "react";

export const AdminTable = (props) => {
  const { setTableId, setTableData } = useContext(AdminTablesContext);

  const deleteTable = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/table/${props.id}`);
      props.refetch();
    } catch (err) {}
  };

  return (
    <div className="bg-white flex flex-col items-center gap-[10px] p-2 rounded-lg shadow-md">
      <img
        src={`/images/${props.image}`}
        alt={props.number}
        className={props.image === "defaultTableImage.png" ? "w-48" : "w-auto"}
      />
      <h5 className="font-semibold">Столик №{props.number}</h5>
      <div>Вместимость: {props.capacity}</div>
      <button
        className="w-[100%] p-2 text-white bg-[#5B7553] rounded"
        onClick={() => {
          setTableId(props.id);
          setTableData({
            number: props.number,
            capacity: props.capacity,
          });
          props.openModal();
        }}
      >
        Изменить
      </button>
      <button
        className="w-[100%] p-2 text-white bg-[#780C00] rounded"
        onClick={deleteTable}
      >
        Удалить
      </button>
    </div>
  );
};
