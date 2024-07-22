import React from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";

export const Contacts = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#EFF1ED] p-2">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Наши контакты</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Адрес</h2>
            <p>Большая Печёрская ул., 11, Нижний Новгород</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Телефон</h2>
            <p>+7 (831) 291-62-12</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p>lartculinaire@mail.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Рабочие часы</h2>
            <p>Понедельник - Воскресенье: 10:00 - 23:00</p>
          </div>
        </div>
        <div className="col-span-2 overflow-hidden rounded-xl">
          <YMaps>
            <div style={{ width: "100%", height: "600px" }}>
              <Map
                defaultState={{
                  center: [56.32141301219058, 44.0124531271852],
                  zoom: 13,
                }}
                width="100%"
                height="100%"
              >
                {/* Добавление метки */}
                <Placemark geometry={[56.32141301219058, 44.0124531271852]} />
              </Map>
            </div>
          </YMaps>
        </div>
      </div>
    </div>
  );
};
