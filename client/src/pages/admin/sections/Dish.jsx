import { useContext } from "react";
import { AdminDishContext } from "../Dishes";
import axios from "axios";

export const AdminDish = (props) => {
  const { setDish, setDishId } = useContext(AdminDishContext);

  //Удаление блюда
  const deleteDish = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/dish/${props.id}`);
      props.refetch();
    } catch (err) {}
  };

  return (
    <div className="bg-white shadow-md rounded-lg cursor-pointer z-1 grid grid-cols-1 items-center p-4 gap-[20px]">
      <div className="p-2 grid grid-cols-1 items-center justify-center gap-[10px]">
        <div className="div">
          <img
            src={`/images/${props.image}`}
            alt={props.name}
            className="w-[100%] max-w-[500px] rounded-lg mx-auto"
          />
          <div className="text-center">Цена: {props.price} руб.</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h5 className="text-xl font-semibold mb-2">{props.name}</h5>
          <div className="mb-2" style={{ wordWrap: "break-word" }}>
            Описание: {props.description}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-[10px]">
        <button
          className="p-2 bg-[#5B7553] text-white rounded w-[50%s]"
          onClick={() => {
            setDishId(props.id);
            setDish({
              name: props.name,
              description: props.description,
              price: props.price,
              categoryId: props.categoryId,
            });
            props.editDish();
          }}
        >
          Изменить
        </button>
        <button
          className="p-2 bg-[#780C00] text-white rounded w-[50%s]"
          onClick={deleteDish}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};
