const Auth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res
      .status(200)
      .json({ success: false, msg: "Пользователь не авторизован" });
  }
  next();
};

module.exports = {
  Auth,
};
