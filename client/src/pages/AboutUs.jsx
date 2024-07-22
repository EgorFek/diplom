import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";
import { Slide } from "./sections/Slide";

export const AboutUs = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const slide1Text =
    "Наш ресторан специализируется на изысканной кулинарии, предлагая своим гостям разнообразие блюд, приготовленных из отборных ингредиентов в соответствии с лучшими рецептами";
  const slide2Text =
    "Мы гордимся качеством нашего сервиса и стремимся сделать ваше посещение у нас незабываемым. Наши опытные повара и вежливый персонал готовы удовлетворить самые изысканные вкусы и пожелания наших гостей.";
  const slide3Text =
    "В ресторане L'Art Culinaire мы верим, что еда не просто питание, а настоящее искусство. Мы постоянно развиваем нашу кулинарную концепцию, чтобы поражать вас новыми впечатлениями и вкусовыми открытиями.";
  const slide4Text =
    "Приходите в L'Art Culinaire и окунитесь в мир утонченных вкусов и неповторимых ароматов. Мы ждем вас с нетерпением!";

  return (
    <div className="min-h-screen bg-[#EFF1ED] flex justify-center items-center">
      <div className="container flex flex-col justify-between gap-[60px] min-h-[50vh] mx-auto text-center text-white p-8 round">
        <div className="bg-white text-[#0D1821] p-4 rounded-lg mb-4 shadow-md">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            О нас - L'Art Culinaire
          </h1>
          <p className="text-lg md:text-xl">
            Добро пожаловать в ресторан L'Art Culinaire! Мы рады приветствовать
            вас в нашем уютном заведении, где вы можете насладиться изысканной
            кухней и уютной атмосферой.
          </p>
        </div>
        <Slider {...sliderSettings} className="shadow-md bg-white rounded-xl">
          <Slide image={slide1} text={slide1Text} />
          <Slide image={slide2} text={slide2Text} />
          <Slide image={slide3} text={slide3Text} />
          <Slide image={slide4} text={slide4Text} />
        </Slider>
      </div>
    </div>
  );
};

export default AboutUs;
