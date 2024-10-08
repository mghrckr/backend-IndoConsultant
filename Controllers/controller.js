const { Carousel, News, Output, Portfolio, Ruanglingkup, User } = require('../models');
const fs = require('fs');
const path = require('path');
const { checkPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class Controller {

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: 'wrong data' };

      const isValidPassword = checkPassword(password, user.password);
      if (!isValidPassword) throw { name: 'wrong data' };

      const access_token = signToken({
        id: user.id,
        email: user.email
      });
      const role = user.role;
      const id = user.id;
      res.status(200).json({
        access_token,
        role,
        id
      });
    } catch (err) {
      next(err);
    }
  }

  // ========== Carousel ==========
  static async createCarousel(req, res) {
    try {
      const { PortfolioId } = req.body;
      let gambar = null;

      if (req.file) {
        const filePath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
        gambar = `/uploads/${req.file.filename}`;
      }

      const newCarousel = await Carousel.create({ PortfolioId, gambar });
      res.status(201).json(newCarousel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async readCarousel(req, res) {
    try {
      const carousels = await Carousel.findAll();
      res.status(200).json(carousels);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCarousel(req, res) {
    try {
        const { id } = req.params;
        const { PortfolioId } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const carousel = await Carousel.findByPk(id);
        if (!carousel) return res.status(404).json({ message: "Not found" });

        if (gambar && carousel.gambar) {
            const filePath = path.join(__dirname, '..', 'public', carousel.gambar);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.error(`File tidak ditemukan: ${filePath}`);
            }
        }

        await Carousel.update({ PortfolioId, gambar }, { where: { id } });
        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

  static async deleteCarousel(req, res) {
    try {
      const { id } = req.params;

      const carousel = await Carousel.findByPk(id);
      if (!carousel) return res.status(404).json({ message: "Not found" });

      if (carousel.gambar) {
        const filePath = path.join(__dirname, '..', 'public', carousel.gambar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.error(`File tidak ditemukan: ${filePath}`);
          return res.status(404).json({ message: 'File tidak ditemukan' });
        }
      }

      await Carousel.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ========== News ==========
  static async createNews(req, res) {
    try {
      const { judul, isi } = req.body;
      let gambar = null;

      if (req.file) {
        const filePath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
        gambar = `/uploads/${req.file.filename}`;
      }

      const newNews = await News.create({ judul, isi, gambar });
      res.status(201).json(newNews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async readNews(req, res) {
    try {
      const news = await News.findAll();
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateNews(req, res) {
    try {
        const { id } = req.params;
        const { judul, isi } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const news = await News.findByPk(id);
        if (!news) return res.status(404).json({ message: "Not found" });

        if (gambar && news.gambar) {
            const filePath = path.join(__dirname, '..', 'public', news.gambar);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.error(`File tidak ditemukan: ${filePath}`);
            }
        }

        await News.update({ judul, isi, gambar }, { where: { id } });
        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

  static async deleteNews(req, res) {
    try {
      const { id } = req.params;

      const news = await News.findByPk(id);
      if (!news) return res.status(404).json({ message: "Not found" });

      if (news.gambar) {
        const filePath = path.join(__dirname, '..', 'public', news.gambar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.error(`File tidak ditemukan: ${filePath}`);
          return res.status(404).json({ message: 'File tidak ditemukan' });
        }
      }

      await News.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ========== Output ==========
  static async createOutput(req, res) {
    try {
      const { PortfolioId, isi } = req.body;
      const newOutput = await Output.create({ PortfolioId, isi });
      res.status(201).json(newOutput);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async readOutput(req, res) {
    try {
      const outputs = await Output.findAll();
      res.status(200).json(outputs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateOutput(req, res) {
    try {
      const { id } = req.params;
      const { PortfolioId, isi } = req.body;

      const output = await Output.findByPk(id);
      if (!output) return res.status(404).json({ message: "Not found" });

      await Output.update({ PortfolioId, isi }, { where: { id } });
      res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteOutput(req, res) {
    try {
      const { id } = req.params;

      const output = await Output.findByPk(id);
      if (!output) return res.status(404).json({ message: "Not found" });

      await Output.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ========== Ruanglingkup ==========
  static async createRuanglingkup(req, res) {
    try {
      const { PortfolioId, isi } = req.body;
      const newRuanglingkup = await Ruanglingkup.create({ PortfolioId, isi });
      res.status(201).json(newRuanglingkup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async readRuanglingkup(req, res) {
    try {
      const ruanglingkup = await Ruanglingkup.findAll();
      res.status(200).json(ruanglingkup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRuanglingkup(req, res) {
    try {
      const { id } = req.params;
      const { PortfolioId, isi } = req.body;

      const ruanglingkup = await Ruanglingkup.findByPk(id);
      if (!ruanglingkup) return res.status(404).json({ message: "Not found" });

      await Ruanglingkup.update({ PortfolioId, isi }, { where: { id } });
      res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteRuanglingkup(req, res) {
    try {
      const { id } = req.params;

      const ruanglingkup = await Ruanglingkup.findByPk(id);
      if (!ruanglingkup) return res.status(404).json({ message: "Not found" });

      await Ruanglingkup.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ========== Portfolio ==========
  static async createPortfolio(req, res) {
    try {
      console.log(req.body);
      const { judul, isi, lingkupPekerjaan, divisi } = req.body;
      let gambar = null;

      if (req.file) {
        const filePath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
        gambar = `/uploads/${req.file.filename}`;
      }

      const newPortfolio = await Portfolio.create({ judul, isi, lingkupPekerjaan, gambar, divisi });
      res.status(201).json(newPortfolio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async readPortfolio(req, res) {
    try {
      const portfolios = await Portfolio.findAll();
      res.status(200).json(portfolios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePortfolio(req, res) {
    try {
        const { id } = req.params;
        const { judul, isi, lingkupPekerjaan, divisi } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const portfolio = await Portfolio.findByPk(id);
        if (!portfolio) return res.status(404).json({ message: "Not found" });

        if (gambar && portfolio.gambar) {
            const filePath = path.join(__dirname, '..', 'public', portfolio.gambar);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.error(`File tidak ditemukan: ${filePath}`);
            }
        }

        await Portfolio.update({ judul, isi, lingkupPekerjaan, gambar, divisi }, { where: { id } });
        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

  static async deletePortfolio(req, res) {
    try {
      const { id } = req.params;

      const portfolio = await Portfolio.findByPk(id);
      if (!portfolio) return res.status(404).json({ message: "Not found" });

      if (portfolio.gambar) {
        const filePath = path.join(__dirname, '..', 'public', portfolio.gambar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.error(`File tidak ditemukan: ${filePath}`);
          return res.status(404).json({ message: 'File tidak ditemukan' });
        }
      }

      await Portfolio.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


}

module.exports = Controller;