const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
    static async showToughts(req, res) {
        res.render("toughts/home");
    }

    static async dashboard(req, res) {
        if (!req.session.userid) {
            res.redirect("/login");
        }

        const userId = req.session.userid;

        const userData = await User.findOne({
            where: { id: userId },
            include: Tought,
            plain: true,
        });

        if (!userData) {
            res.redirect("/login");
        }

        const toughts = userData.Toughts.map((result) => result.dataValues);

        let emptyToughts = false;
        toughts.length > 0 ? (emptyToughts = false) : (emptyToughts = true);

        res.render("toughts/dashboard", { toughts, emptyToughts });
    }

    static createTought(req, res) {
        res.render("toughts/create");
    }

    static async createToughtSave(req, res) {
        if (!req.session.userid) {
            res.redirect("/login");
            return;
        }

        if (!req.body.title || req.body.title.length < 3) {
            req.flash("message", "Caracteres insuficientes");
            res.render("toughts/create");
            return;
        }

        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        };

        try {
            await Tought.create(tought);

            req.flash("message", "Pensamento criado com sucesso");

            req.session.save(() => {
                res.redirect("/toughts/dashboard");
            });
        } catch (err) {
            console.error(
                "Ocorreu um erro ao tentar criar o pensamento: " + err
            );
        }
    }

    static async removeTought(req, res) {
        const toughtId = req.body.id;
        const userId = req.session.userid;

        try {
            await Tought.destroy({ where: { id: toughtId, UserId: userId } });

            req.flash("message", "Pensamento removido com sucesso");

            req.session.save(() => {
                res.redirect("/toughts/dashboard");
            });
        } catch (err) {
            console.error("Ocorreu um erro ao remover o pensamento: " + err);
        }
    }
};
