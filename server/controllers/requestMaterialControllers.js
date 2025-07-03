const { sendEmailReminderAdmin } = require("../helpers/nodemailer");
const { Stock, User, Material, MaterialRequest } = require("../models");

class RequestMaterialController {
  static async createMaterialRequest(req, res) {
    try {
      const { materialId, quantity } = req.body;

      const findMaterial = await Material.findOne({
        where: { id: materialId },
      });
      if (!findMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }

      if (quantity > findMaterial.totalStock) {
        return res.status(400).json({ message: "Stock not enough" });
      }

      const newMaterialRequest = await MaterialRequest.create({
        materialId,
        quantity,
        userId: req.user.id,
      });

      res.status(200).json({ id: newMaterialRequest.id });
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

  static async getMaterialRequest(req, res) {
    try {
      const { status } = req.query;

      let whereCondition = {};

      if (status === "request") {
        whereCondition.status = ["submitted", "revised"];
      }
      if (status === "completed") {
        whereCondition.status = "completed";
      }

      const stock = await MaterialRequest.findAll({
        where: whereCondition,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["username", "email", "id", "areaKerja"],
          },
          {
            model: Material,
            attributes: [
              "materialName",
              "materialNumber",
              "satuan",
              "totalStock",
            ],
          },
        ],
      });
      res.status(200).json({ data: stock });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { reasonRevise, status } = req.body;
      const { role } = req.user;

      if (role !== "admin") {
        return res.status(401).json({ message: "You are not authorized" });
      }

      const findRequest = await MaterialRequest.findOne({
        where: { id: id },
      });

      if (!findRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      const findMaterial = await Material.findOne({
        where: { id: findRequest.materialId },
      });

      if (!findMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }

      if (status === "approved") {
        if (findMaterial?.quantity > findMaterial?.totalStock) {
          return res.status(400).json({ message: "Stock tidak mencukupi" });
        }

        await MaterialRequest.update(
          { status: "completed" },
          { where: { id: id } }
        );

        if (findRequest.quantity > findMaterial.totalStock) {
          return res.status(400).json({ message: "Stock tidak mencukupi" });
        }

        await Material.update(
          { totalStock: findMaterial.totalStock - findRequest.quantity },
          { where: { id: findRequest.materialId } }
        );

        // reminder under 30%
        const findStock = await Stock.findAll({
          where: {
            materialId: findMaterial?.id,
            status: "completed",
          },
        });
        const findTotalStockCompleted = findStock.reduce(
          (total, stock) => total + stock.quantity,
          0
        );
        const raw = findTotalStockCompleted * 0.3;
        const reminderStock = Math.ceil(raw % 2 === 0 ? raw : raw + 1);


        if (findMaterial.totalStock <= reminderStock) {
          sendEmailReminderAdmin("andriii150221@gmail.com", findMaterial);
        }

        res.status(200).json({ message: "Request updated successfully" });
      }

      if (status === "revised") {
        await MaterialRequest.update(
          { status: "revised", reasonRevise: reasonRevise },
          { where: { id: id } }
        );
        res.status(200).json({ message: "Request updated successfully" });
      }
    } catch (error) {
      console.log(error, ",<<<");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateMaterialRequest(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const find = await MaterialRequest.findOne({ where: { id: id } });
      if (!find) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (quantity > find.totalStock) {
        return res.status(400).json({ message: "Stock not enough" });
      }

      if (find?.status === "revised") {
        await MaterialRequest.update(
          { quantity, status: "submitted" },
          { where: { id: id } }
        );
        return res
          .status(200)
          .json({ message: "Request updated successfully" });
      }

      await MaterialRequest.update({ quantity }, { where: { id: id } });
      res.status(200).json({ message: "Request updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteMaterialRequest(req, res) {
    try {
      const { id } = req.params;

      const find = await MaterialRequest.findOne({ where: { id: id } });
      if (!find) return res.status(404).json({ message: "Request not found" });

      if (!find.status === "completed")
        return res
          .status(404)
          .json({ message: "Cannot delete completed request" });

      await MaterialRequest.destroy({ where: { id: id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = RequestMaterialController;
