import userIcon from "../../assets/userIcon.png";
import orderIcon from "../../assets/orderIcon.png";
import mealIcon from "../../assets/meal.png";
import tableIcon from "../../assets/table.png";
import menuIcon from "../../assets/menu.png";

import { Link } from "react-router-dom";

export const AdminPanel = () => {
  const cardClasses =
    "bg-white shadow-md rounded-lg overflow-hidden min-h-[210px] p-2";

  const cardBody = "flex flex-col items-center justify-center gap-[20px]";

  return (
    <div className="min-h-[90vh] flex items-center bg-[#EFF1ED] p-2">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
          <Link to="/admin/orders" className={cardClasses}>
            <div className={cardBody}>
              <img src={orderIcon} alt="Order Icon" className="w-32 h-32" />
              <div className="text-lg font-semibold">Заказы</div>
            </div>
          </Link>
          <Link to="/admin/dishes" className={cardClasses}>
            <div className={cardBody}>
              <img src={mealIcon} alt="Order Icon" className="w-32 h-32" />
              <div className="text-lg font-semibold">Блюда</div>
            </div>
          </Link>
          <Link to="/admin/tables" className={cardClasses}>
            <div className={cardBody}>
              <img src={tableIcon} alt="Order Icon" className="w-32 h-32" />
              <div className="text-lg font-semibold">Столики</div>
            </div>
          </Link>
          <Link to="/admin/categories" className={cardClasses}>
            <div className={cardBody}>
              <img src={menuIcon} alt="Order Icon" className="w-32 h-32" />
              <div className="text-lg font-semibold">Категории блюд</div>
            </div>
          </Link>
          <Link to="/admin/users" className={cardClasses}>
            <div className="p-4">
              <div className={cardBody}>
                <img src={userIcon} alt="User Icon" className="w-32 h-32" />
                <div className="text-lg font-semibold">Пользователи</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
