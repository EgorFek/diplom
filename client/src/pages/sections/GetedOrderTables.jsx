import moment from "moment";
import axios from "axios";

export const GetedOrderTables = (props) => {
  const dateMoment = moment(props.date);

  const formattedDate = dateMoment.format("YYYY-MM-DD");

  const formattedTime = dateMoment.format("HH:mm");

  //Удаление столика из заказа
  const handleDelete = async () => {
    console.log(123);
    try {
      axios.delete("http://localhost:3001/api/v1/session/order/removeTable", {
        data: { tableId: props.tableId },
      });
      props.refetchOrder();
    } catch (err) {}
  };

  return (
    <div className="bg-white flex flex-col items-center gap-[10px] p-2 rounded-lg shadow-md">
      <img src={`/images/${props.image}`} alt={props.number} className="w-48" />
      <h5 className="font-semibold">Столик №{props.number}</h5>
      <div>Вместимость: {props.capacity}</div>
      <div>Дата: {formattedDate}</div>
      <div>Время: {formattedTime}</div>
      <button
        className="p-2 bg-[#780C00] rounded text-white"
        onClick={handleDelete}
      >
        Удалить
      </button>
    </div>
  );
};
