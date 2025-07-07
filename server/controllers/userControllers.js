const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async getAllUser(req, res) {
    try {
      const { filter, search, page = 1, limit = 10 } = req.query;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const whereConditions = {
        [Op.and]: [
          {
            [Op.or]: [
              { username: { [Op.like]: search ? `%${search}%` : "%" } },
              { email: { [Op.like]: search ? `%${search}%` : "%" } },
              {
                "$User.username$": { [Op.like]: search ? `%${search}%` : "%" },
              },
              { "$User.email$": { [Op.like]: search ? `%${search}%` : "%" } },
            ],
          },
        ],
      };

      const { count, rows } = await User.findAndCountAll({
        where: whereConditions,
        order: [["createdAt", "DESC"]],
        // limit: limitNum,
        // offset,
        attributes: { exclude: ["password"] },
      });

      const totalPages = Math.ceil(count / limitNum);
      const [userCount, adminCount, supervisor1Count, supervisor2Count] =
        await Promise.all([
          User.count({ where: { ...whereConditions, role: "user" } }),
          User.count({ where: { ...whereConditions, role: "admin" } }),
          User.count({ where: { ...whereConditions, role: "supervisor_1" } }),
          User.count({ where: { ...whereConditions, role: "supervisor_2" } }),
        ]);

      res.status(200).json({
        totalItems: count,
        totalPages,
        currentPage: pageNum,
        total_user_user: userCount,
        total_user_admin: adminCount,
        total_user_supervisor_1: supervisor1Count,
        total_user_supervisor_2: supervisor2Count,
        data: rows,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password, role, areaKerja } = req.body;

      // 1. validate unique email
      const validateEmail = await User.findOne({ where: { email } });
      if (validateEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // 2. validate length of password
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      // 3. create account
      const newUser = await User.create({
        username,
        email,
        password,
        role,
        areaKerja,
      });

      // 4. response without password
      const responseWithoutPassword = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        areaKerja: newUser.areaKerja,
      };

      res.status(200).json(responseWithoutPassword);
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateUser(req, res) {
    try {
      const id = req.body.id;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { email, areaKerja } = req.body;

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }

      await User.update({ email, areaKerja }, { where: { id } });
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getUserDetail(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw { name: "User not found" };
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await User.destroy({ where: { id } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      // 1. validasi form
      if (!email)
        return res.status(400).json({ message: "Please enter your email" });
      if (!password)
        return res.status(400).json({ message: "Please enter your password" });

      // 2. cari user
      let findUser = await User.findOne({ where: { email } });
      if (!findUser)
        return res.status(401).json({ message: "Invalid email/password" });

      // 3. verify password
      let checkPassword = comparePassword(password, findUser.password);
      if (!checkPassword)
        return res.status(401).json({ message: "Invalid email/password" });

      let access_token = signToken({
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      });

      res.status(200).json({
        data: {
          access_token: access_token,
          role: findUser.role,
        },
      });
    } catch (error) {
      console.log(error, '<<')
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getLoggedInUser(req, res) {
    try {
      const { email } = req.user;
      const findUser = await User.findOne({ where: { email } });
      if (!findUser) return res.status(404).json({ message: "User not found" });

      res.status(200).json(findUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
