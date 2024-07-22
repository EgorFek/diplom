module.exports = (sequelize, DataTypes) => {
  const DishCategory = sequelize.define(
    "DishCategory",
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  DishCategory.associate = (models) => {
    DishCategory.hasMany(models.Dish, {
      onDelete: "CASCADE",
      hooks: true,
    });
  };

  return DishCategory;
};
