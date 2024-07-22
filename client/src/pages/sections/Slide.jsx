export const Slide = (props) => {
  return (
    <div className="grid  grid-cols-1 sm:grid-cols-2">
      <img
        src={props.image}
        alt="slide"
        className="rounded-xl max-h-[400px] d-block"
      />
      <div className="text-[#0D1821] p-3 flex items-center">
        <p>{props.text}</p>
      </div>
    </div>
  );

  return (
    <div className="text-lg bg-cover md:text-xl flex flex-col sm:flex-row gap-[10px] p-2 bg-white rounded-xl text-[#0D1821] items-center">
      <img
        src={props.image}
        alt="slide"
        className="rounded-xl max-h-[400px] d-block"
      />
      <p>{props.text}</p>
    </div>
  );
};
