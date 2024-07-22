import { useState } from "react";
import editIcon from "../../../assets/editIcon.png";
import axios from "axios";

export const Category = (props) => {
  axios.defaults.withCredentials = true;

  const [isChanging, setIsChanging] = useState(false);

  const handleKeyPressed = async (event) => {
    if (event.key === "Enter") {
      try {
        await axios.put(`http://localhost:3001/api/v1/category/${props.id}`, {
          newCategoryName: event.target.value,
        });
        setIsChanging(false);
        props.refetch();
      } catch (err) {
        console.log(err.response.data.msg);
      }
    }
  };

  const deleteCategory = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/category/${props.id}`);
      props.refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex flex-col gap-[10px]">
      <div className="flex gap-[5px] justify-center">
        {isChanging ? (
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-1 md:w-full md:py-2"
            defaultValue={props.name}
            onKeyDown={handleKeyPressed}
          />
        ) : (
          <p className="text-lg font-semibold text-center">{props.name}</p>
        )}
        <button
          onClick={() => {
            setIsChanging(!isChanging);
          }}
        >
          <img src={editIcon} alt="" className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-grow" />
      <button
        className="bg-[#780C00] text-white px-4 py-2 rounded-md mt-2 md:mt-0 md:ml-2"
        onClick={deleteCategory}
      >
        Удалить
      </button>
    </div>
  );
};
