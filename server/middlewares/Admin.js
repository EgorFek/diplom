const Admin = (req, res, next) => {
  if (req.session.user.UserStatusId !== 2) {
    return res
      .status(200)
      .json({ success: false, msg: "Вы не являетесь администратором" });
  }
  next();
};

module.exports = {
  Admin,
};
