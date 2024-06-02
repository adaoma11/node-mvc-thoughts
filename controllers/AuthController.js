const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
    static login(req, res) {
        res.render("auth/login");
    }

    static async loginPost(req, res) {
        if (!req.body.email) {
            req.flash("message", "Informe o e-mail");
            res.render("auth/login");
            return;
        }

        if (!req.body.password) {
            req.flash("message", "Informe a senha");
            res.render("auth/login");
            return;
        }

        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const passMatch = await bcrypt.compare(password, user.password);

            if (passMatch) {
                // Session Init
                req.session.userid = user.id;

                req.flash("message", "Login efetuado com sucesso");

                req.session.save(() => {
                    res.redirect("/");
                });

                return;
            }
        }

        req.flash("message", "Usuário e/ou senha incorreto(s)");
        res.render("auth/login");
        return;
    }

    static signup(req, res) {
        res.render("auth/signup");
    }

    static async signupPost(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        // password match validation
        if (password != confirmpassword) {
            req.flash("message", "As senhas não conferem. Tente novamente.");
            res.render("auth/signup");

            return;
        }

        // checks if user already exists
        const checkIfUserExists = await User.findOne({
            where: { email: email },
        });

        if (checkIfUserExists) {
            req.flash("message", "Esta conta já existe.");
            res.render("auth/signup");

            return;
        }

        // create a password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword,
        };

        try {
            const createdUser = await User.create(user);

            // Session Init
            req.session.userid = createdUser.id;
            console.log(req.session);

            req.flash("message", "Cadastro realizado com sucesso!");

            req.session.save(() => {
                res.redirect("/");
            });
        } catch (err) {
            console.error("Erro ao cadastrar usuário:" + err);
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
};
