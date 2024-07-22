import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

export const ReservationForm = (props) => {
  const schema = yup.object().shape({
    date: yup.date().required("Дата обязательна"),
    time: yup.string().required("Время обязательно"),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [reservationError, setReservationError] = useState("");

  //Проверка резервации столика на выьранную дату
  const isTableReserved = async (date) => {
    console.log(date);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/table/${props.tableId}/reserve`,
        { params: { date: date } }
      );
      const responseData = response.data;
      return responseData.data.reserved;
    } catch (err) {
      return true;
    }
  };

  //Получение текущей даты
  const getCurrentDate = () => {
    return moment().format("YYYY-MM-DD");
  };

  //Резервация столика
  const reserveTable = async (date, time) => {
    try {
      await axios.get("http://localhost:3001/api/v1/session/order/addTable", {
        params: { tableId: props.tableId, date, time },
      });
      props.refetchOrder();
    } catch (err) {
      console.log("Не удалось добавить столик в заказ");
    }
  };

  //Подтверждение формы
  const onSubmit = async (data) => {
    const { date, time } = data;

    const currentDateWithoutTime = moment().startOf("day");
    const currentTime = moment().startOf("minute");

    if (moment(date).isBefore(currentDateWithoutTime)) {
      setReservationError("На эту дату нельзя зарезервировать столик");
      return;
    }

    if (
      moment(date).isSame(currentDateWithoutTime) &&
      moment(time, "HH:mm").isSameOrBefore(currentTime)
    ) {
      setReservationError("Выберите время позже текущего");
      return;
    }

    const startTime = moment("10:00", "HH:mm");
    const endTime = moment("22:00", "HH:mm");
    const selectedTime = moment(time, "HH:mm");

    if (!selectedTime.isBetween(startTime, endTime, null, "[]")) {
      setReservationError("Время должно быть в диапазоне с 10:00 до 22:00");
      return;
    }

    const isReserved = await isTableReserved(date);

    if (isReserved) {
      setReservationError("На эту дату столик уже был зарезервирован");
      return;
    }

    setReservationError("");

    await reserveTable(date, time);

    props.closeForm();
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <h1 className="text-center text-xl font-bold mb-4">
        Резервация столика №{props.tableNumber}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-black font-semibold mb-2">
            Дата:
          </label>
          <input
            type="date"
            id="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            min={getCurrentDate()}
            {...register("date")}
          />
          {errors?.date && (
            <div className="text-red-400 mt-1">{errors.date.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="time"
            className="block text-gray-700 font-semibold mb-2"
          >
            Время:
          </label>
          <input
            type="time"
            id="time"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            min="10:00"
            max="22:00"
            {...register("time")}
          />
          {errors?.time && (
            <div className="text-red-400 mt-1">{errors.time.message}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-[#5B7553] text-white font-semibold py-2 px-4 rounded-md"
        >
          Зарезервировать
        </button>
        {reservationError && (
          <div className="text-red-400 mt-2">{reservationError}</div>
        )}
      </form>
    </div>
  );
};
