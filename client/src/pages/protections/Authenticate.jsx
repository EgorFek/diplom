import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../App";

export const Authenticate = (props) => {
  const { isAuth } = useContext(AppContext);

  return isAuth ? props.page : <Navigate to="/login" />;
};
