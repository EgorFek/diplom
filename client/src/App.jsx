import "./App.css";
import { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  Main,
  Login,
  Orders,
  Dishes,
  Profile,
  AboutUs,
  Loading,
  Contacts,
  Register,
  NotFound,
  CreateOrder,
  AdminDishes,
  AdminTables,
  DishCategories,
  AdminPanel,
  AdminOrders,
  AdminUsers,
} from "./pages";

import { Authenticate } from "./pages";
import { Admin } from "./pages/protections/Admin";

import { Header } from "./Header";
import { Footer } from "./Footer";

import axios from "axios";

export const AppContext = createContext();

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [prevPage, setPrevPage] = useState("/");

  axios.defaults.withCredentials = true;

  const storeCurrentUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/session/auth"
      );
      const responseData = response.data;
      setIsAuth(responseData.isAuth);
      if (responseData.isAuth) {
        setUser(responseData.user);
      }

      return responseData.user;
    } catch (error) {
      console.log(error.resposne);
      return {};
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: storeCurrentUserData,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppContext.Provider value={{ user, isAuth, setIsAuth, setUser }}>
      <Router>
        <Header setPrev={setPrevPage} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route
            path="/login"
            element={
              <Login checkAuth={storeCurrentUserData} navigateTo={prevPage} />
            }
          />
          <Route
            path="/register"
            element={<Register checkAuth={storeCurrentUserData} />}
          />
          <Route
            path="/profile"
            element={
              <Authenticate
                page={<Profile changeData={storeCurrentUserData} />}
              />
            }
          />
          <Route path="/orders" element={<Authenticate page={<Orders />} />} />
          <Route
            path="/create/order"
            element={<Authenticate page={<CreateOrder />} />}
          />
          <Route path="/admin" element={<Admin page={<AdminPanel />} />} />
          <Route
            path="/admin/orders"
            element={<Admin page={<AdminOrders />} />}
          />
          <Route
            path="/admin/dishes"
            element={<Admin page={<AdminDishes />} />}
          />
          <Route
            path="/admin/categories"
            element={<Admin page={<DishCategories />} />}
          />
          <Route
            path="/admin/tables"
            element={<Admin page={<AdminTables />} />}
          />
          <Route
            path="/admin/users"
            element={<Admin page={<AdminUsers />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </AppContext.Provider>
  );
}
