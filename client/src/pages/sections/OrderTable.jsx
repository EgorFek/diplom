export const OrderTable = (props) => {
  return (
    <div
      className="bg-white flex flex-col items-center gap-[10px] p-2 rounded-lg shadow-md"
      onClick={() => {
        props.setTableId(props.id);
        props.setTableNumber(props.number);
        props.openForm();
      }}
    >
      <img src={`/images/${props.image}`} alt={props.number} className="w-48" />
      <h5 className="font-semibold">Столик №{props.number}</h5>
      <div>Вместимость: {props.capacity}</div>
    </div>
  );
};
