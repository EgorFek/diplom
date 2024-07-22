import axios from "axios";

export const TableLine = (props) => {
  const { user } = props;

  //Изменеие статуса на "admin"
  const changeStatusToAdmin = async () => {
    try {
      console.log(user.id);
      const response = await axios.put(
        `http://localhost:3001/api/v1/user/status/admin`,
        { id: user.id }
      );
      if (response.data.success) {
        props.refetch();
      }
    } catch (err) {}
  };

  //Изменеие статуса на "user"
  const changeStatusToUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/v1/user/status/user`,
        { id: user.id }
      );
      if (response.data.success) {
        props.refetch();
      }
    } catch (err) {}
  };

  //Удаление пользователя
  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/v1/user/${user.id}`,
        { id: user.id }
      );
      if (response.data.success) {
        props.refetch();
      }
    } catch (err) {}
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-center">{user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {user.surname}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-center">*****</td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {user.UserStatus.status}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {user.UserStatusId === 1 ? (
          <button
            className="px-2 py-1 bg-[#344966] text-white rounded"
            onClick={changeStatusToAdmin}
          >
            Сделать администратором
          </button>
        ) : (
          <button
            className="px-2 py-1 bg-[#344966] text-white rounded"
            onClick={changeStatusToUser}
          >
            Сделать пользователем
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          className="px-2 py-1 bg-[#780C00] text-white rounded"
          onClick={deleteUser}
        >
          Удалить
        </button>
      </td>
    </tr>
  );
};
