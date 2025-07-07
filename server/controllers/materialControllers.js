const { Stock, User, Material, MaterialRequest } = require("../models");

class MaterialController {
  static async createMaterial(req, res) {
    try {
      const { materialName, satuan, limited } = req.body;

      const newMaterial = await Material.create({
        materialName,
        satuan,
        limited,
        userId: req.user.id,
      });

      const materialNumber = `M-${String(newMaterial.id).padStart(4, "0")}`;
      await Material.update(
        { materialNumber },
        { where: { id: newMaterial.id } }
      );

      res.status(200).json(newMaterial);
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

  static async getAllMaterial(req, res) {
    try {
      const { page = 1 } = req.query;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(10);
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Material.findAndCountAll({
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset,
      });

      const totalPages = Math.ceil(count / limitNum);

      res.status(200).json({
        totalItems: count,
        totalPages,
        currentPage: pageNum,
        data: rows,
      });
    } catch (error) {
      console.log(error, "<<");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMaterialById(req, res) {
    try {
      const { id } = req.params;
      const findMaterial = await Material.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
          {
            model: Stock,
            attributes: [
              "materialId",
              "quantity",
              "status",
              "hargaSatuan",
              "hargaTotal",
              "reasonRevise",
              "createdAt",
            ],
          },
        ],
      });

      if (!findMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }

      res.status(200).json(findMaterial);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateMaterial(req, res) {
    try {
      const { id } = req.params;
      const { materialName, satuan, limited } = req.body;

      const findMaterial = await Material.findOne({ where: { id } });
      if (!findMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }

      if (findMaterial.userId !== req.user.id) {
        return res.status(401).json({ message: "You are not authorized" });
      }

      await Material.update(
        { materialName, satuan, limited },
        { where: { id } }
      );

      res.status(200).json({ message: "Material updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteMaterial(req, res) {
    try {
      const { id } = req.params;

      const findMaterial = await Material.findOne({ where: { id } });
      if (!findMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }

      if (findMaterial.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(401).json({ message: "You are not authorized" });
      }

      await MaterialRequest.destroy({
        where: { materialId: id },
      });

      await Stock.destroy({
        where: { materialId: id },
      });
      await Material.destroy({
        where: { id },
      });

      res.status(200).json({ message: "Material deleted successfully" });
    } catch (error) {
      console.log(error, '<<')
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = MaterialController;
