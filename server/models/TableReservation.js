module.exports = (sequelize, DataTypes) => {
  const TableReservation = sequelize.define(
    "TableReservation",
    {
      reservation: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          async isNotCollideWithOtherReservation(date) {
            const dateOnly = sequelize.fn(
              "DATE",
              sequelize.col("reservationDate")
            );

            const existingReservation = await TableReservation.findOne({
              where: sequelize.where(dateOnly, date),
            });

            if (existingReservation) {
              throw new Error("Столик уже зарезервирован на эту дату.");
            }
          },
        },
      },
    },
    { timestamps: false }
  );

  return TableReservation;
};
