module.exports = (sequelize, DataTypes) => {
  const UserStatus = sequelize.define(
    "UserStatus",
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  UserStatus.associate = (models) => {
    UserStatus.hasMany(models.User, { onDelete: "CASCADE" });
  };

  return UserStatus;
};
