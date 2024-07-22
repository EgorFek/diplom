import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../App";

export const Admin = (props) => {
  const { isAuth, user } = useContext(AppContext);

  return isAuth && user.UserStatusId === 2 ? props.page : <Navigate to="/" />;
};
