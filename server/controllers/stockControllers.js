const { sendEmail } = require("../helpers/nodemailer");
const { Stock, User, Material } = require("../models");
const { Op } = require("sequelize");

class StockController {
  static async createStock(req, res) {
    try {
      const { materialId, quantity } = req.body;

      const newStock = await Stock.create({
        materialId,
        quantity,
        userId: req.user.id,
      });

      // sendE
      const stock = await Stock.findOne({
        where: { id: newStock.id },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
          {
            model: Material,
            attributes: ["materialName", "materialNumber", "satuan"],
          },
        ],
      });

      sendEmail("catheringsupervisorsatu@gmail.com", stock);
      res.status(200).json(newStock);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getTrendStock(req, res) {
    try {
      const year = Number(req.query.year);

      const material = await Material.findAll({
        include: [
          {
            model: Stock,
            required: false,
            where: {
              status: "completed",
              createdAt: {
                [Op.gte]: new Date(`${year}-01-01T00:00:00.000Z`),
                [Op.lt]: new Date(`${year + 1}-01-01T00:00:00.000Z`),
              },
            },
          },
        ],
      });

      res.status(200).json({ data: material });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getStocks(req, res) {
    try {
      const { status } = req.query;

      let whereCondition = {};

      if (status === "request") {
        whereCondition.status = ["submitted", "approved", "revised"];
      }
      if (status === "completed") {
        whereCondition.status = "completed";
      }

      const stock = await Stock.findAll({
        where: whereCondition,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
          {
            model: Material,
            attributes: ["materialName", "materialNumber", "satuan"],
          },
        ],
      });

      res.status(200).json({ data: stock });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getStockById(req, res) {
    try {
      const { id } = req.params;
      const findStock = await Stock.findAll({
        where: { materialId: id },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
        ],
      });

      if (!findStock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      res.status(200).json(findStock);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { materialId, quantity } = req.body;

      if (quantity === null) {
        return res.status(400).json({ message: "Quantity is required" });
      }

      const findStock = await Stock.findOne({ where: { id } });
      if (!findStock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      if (findStock?.status === "revised") {
        await Stock.update(
          {
            materialId,
            quantity,
            reasonRevise: null,
            status: "submitted",
          },
          { where: { id } }
        );
        res.status(200).json({ message: "Stock updated successfully" });
        return;
      }

      await Stock.update({ materialId, quantity }, { where: { id } });
      res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateStockPrice(req, res) {
    try {
      const { id } = req.params;
      const { hargaSatuan, hargaTotal } = req.body;

      if (hargaSatuan === null || hargaTotal === null) {
        return res.status(400).json({ message: "Harga is required" });
      }

      if (req.user.role === "user") {
        return res.status(401).json({ message: "You are not authorized" });
      }

      const findStock = await Stock.findOne({ where: { id } });
      if (!findStock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      await Stock.update({ hargaSatuan, hargaTotal }, { where: { id } });

      res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id, status, reasonRevise } = req.body;

      const userRole = req.user.role;

      if (userRole !== "supervisor_1" && userRole !== "supervisor_2") {
        return res.status(401).json({ message: "You are not authorized" });
      }

      const stock = await Stock.findOne({
        where: { id: id },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
          {
            model: Material,
            attributes: ["materialName", "materialNumber", "satuan"],
          },
        ],
      });

      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      if ((!stock.hargaTotal || !stock.hargaSatuan) && status !== "revised") {
        return res
          .status(400)
          .json({ message: "Mohon update harga terlebih dahulu" });
      }

      // Approval flow
      if (status === "approved") {
        if (userRole !== "supervisor_1") {
          return res
            .status(401)
            .json({ message: "Only supervisor_1 can approve" });
        }

        // Cek apakah semua stock dalam status 'submitted'
        const isValid = stock.status === "submitted";
        if (!isValid) {
          return res
            .status(400)
            .json({ message: "Only submitted stock can be approved" });
        }
        await Stock.update({ status: "approved" }, { where: { id: id } });
        const findStock = await Stock.findOne({
          where: { id: id },
          include: [
            {
              model: User,
              attributes: ["username", "email"],
            },
            {
              model: Material,
              attributes: ["materialName", "materialNumber", "satuan"],
            },
          ],
        });
        sendEmail("digisuite17@gmail.com", findStock);
        return res.status(200).json({ message: "Stock approved successfully" });
      }

      // Completion flow
      if (status === "completed") {
        if (userRole !== "supervisor_2") {
          return res
            .status(401)
            .json({ message: "Only supervisor_2 can complete" });
        }

        // Cek apakah semua stock dalam status 'approved'
        const isValid = stock.status === "approved";
        if (!isValid) {
          return res
            .status(400)
            .json({ message: "Only approved stock can be completed" });
        }

        const findMaterial = await Material.findOne({
          where: { id: stock.materialId },
        });

        if (!findMaterial) {
          return res.status(404).json({ message: "Material not found" });
        }

        await Stock.update({ status: "completed" }, { where: { id: id } });
        await Material.update(
          { totalStock: findMaterial?.totalStock + stock.quantity },
          { where: { id: stock.materialId } }
        );
        return res
          .status(200)
          .json({ message: "Stock completed successfully" });
      }

      // Revisi flow
      if (status === "revised") {
        if (!reasonRevise || reasonRevise.trim() === "") {
          return res.status(400).json({ message: "Reason revise is required" });
        }

        await Stock.update(
          { status: "revised", reasonRevise },
          { where: { id: id } }
        );

        return res.status(200).json({ message: "Stock revised successfully" });
      }

      return res.status(400).json({ message: "Invalid status provided" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteStock(req, res) {
    try {
      const { id } = req.params;

      const findStock = await Stock.findOne({ where: { id } });
      if (!findStock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      if (findStock.userId !== req.user.id) {
        return res.status(401).json({ message: "You are not authorized" });
      }

      await Stock.destroy({
        where: { id },
      });

      res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = StockController;
