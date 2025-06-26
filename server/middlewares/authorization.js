const { User } = require("../models");

async function authorization(req, res, next) {
  try {
    const { id } = req.user;

    const user = await User.findByPk(id);

    if (!user) throw { name: "notFound" };

    if (
      user.role === "admin" ||
      user.role === "supervisor_1" ||
      user.role === "supervisor_2" ||
      user.role === "user"
    ) {
      next();
    } else {
      throw { name: "unauthorized" };
    }
  } catch (error) {
    console.log(error, "<<");
    next(error);
  }
}

module.exports = authorization;
