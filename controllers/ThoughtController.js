const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = class thoughtController {
    static async showthoughts(req, res) {
        const thoughtsData = await Thought.findAll({ include: User });

        const thoughts = thoughtsData.map((result) =>
            result.get({ plain: true })
        );

        res.render("thoughts/home", { thoughts });
    }

    static async dashboard(req, res) {
        if (!req.session.userid) {
            res.redirect("/login");
        }

        const userId = req.session.userid;

        const userData = await User.findOne({
            where: { id: userId },
            include: Thought,
            plain: true,
        });

        if (!userData) {
            res.redirect("/login");
        }

        const thoughts = userData.thoughts.map((result) => result.dataValues);

        let emptythoughts = false;
        thoughts.length > 0 ? (emptythoughts = false) : (emptythoughts = true);

        res.render("thoughts/dashboard", { thoughts, emptythoughts });
    }

    static createthought(req, res) {
        res.render("thoughts/create");
    }

    static async createthoughtSave(req, res) {
        if (!req.session.userid) {
            res.redirect("/login");
            return;
        }

        if (!req.body.title || req.body.title.length < 3) {
            req.flash("message", "Caracteres insuficientes");
            res.render("thoughts/create");
            return;
        }

        const thought = {
            title: req.body.title,
            UserId: req.session.userid,
        };

        try {
            await Thought.create(thought);

            req.flash("message", "Pensamento criado com sucesso");

            req.session.save(() => {
                res.redirect("/thoughts/dashboard");
            });
        } catch (err) {
            console.error(
                "Ocorreu um erro ao tentar criar o pensamento: " + err
            );
        }
    }

    static async removethought(req, res) {
        const thoughtId = req.body.id;
        const userId = req.session.userid;

        try {
            await Thought.destroy({ where: { id: thoughtId, UserId: userId } });

            req.flash("message", "Pensamento removido com sucesso");

            req.session.save(() => {
                res.redirect("/thoughts/dashboard");
            });
        } catch (err) {
            console.error("Ocorreu um erro ao remover o pensamento: " + err);
        }
    }

    static async updatethought(req, res) {
        const thoughtId = req.params.id;
        const userId = req.session.userid;

        try {
            const thought = await Thought.findOne({
                where: { id: thoughtId, UserId: userId },
                raw: true,
            });

            res.render("thoughts/edit", { thought });
        } catch (err) {
            console.error("Ocorreu um erro ao buscar o pensamento: " + err);
        }
    }

    static async updatethoughtSave(req, res) {
        if (!req.session.userid) {
            res.redirect("/login");
            return;
        }

        const userId = req.session.userid;
        const thoughtId = req.body.id;

        const thought = {
            title: req.body.title,
        };

        if (!req.body.title || req.body.title.length < 3) {
            req.flash("message", "Caracteres insuficientes");
            res.render("thoughts/edit", { thought });
            return;
        }

        try {
            await Thought.update(thought, {
                where: { id: thoughtId, UserId: userId },
            });

            req.flash("message", "Pensamento atualizado com sucesso");

            req.session.save(() => {
                res.redirect("/thoughts/dashboard");
            });
        } catch (err) {
            console.error("Ocorreu um erro ao atualizar o pensamento: " + err);
        }
    }
};
