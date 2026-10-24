// Лаборатория №5. Express — все 19 тем в одном простом проекте.

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Handlebars = require("handlebars");
const { engine } = require("express-handlebars");

const app = express();
const PORT = 3000;
const publicDir = path.join(__dirname, "public");
const viewsDir = path.join(__dirname, "views");

// 1. Начало работы с Express: приложение Express создано выше.

// 2. Middleware: записываем каждый запрос в терминал и server.log.
app.use((req, res, next) => {
    const line = `${new Date().toLocaleTimeString()} ${req.method} ${req.url}`;
    console.log(line);

    fs.appendFile(path.join(__dirname, "server.log"), line + "\n", (error) => {
        if (error) console.error("Не удалось записать server.log:", error.message);
    });

    next(); // передаём запрос следующему обработчику
});

// 8 и 11. Middleware для чтения данных обычных HTML-форм и JSON.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Вспомогательная функция: безопасно показывает пользовательский текст в HTML.
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

// 12–15. Настраиваем Handlebars: views, layout, partials и helpers.
app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: false,
    layoutsDir: path.join(viewsDir, "handlebars", "layouts"),
    partialsDir: path.join(viewsDir, "handlebars", "partials"),
    helpers: {
        getTime() {
            return new Date().toLocaleTimeString();
        },
        createStringList(items) {
            if (!Array.isArray(items)) return "";
            const list = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
            return new Handlebars.SafeString(`<ul>${list}</ul>`);
        }
    }
}));
app.set("view engine", "hbs");
app.set("views", viewsDir);

// 1. Главная страница: отдаём HTML-файл.
app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

// 4. Статические файлы: всё внутри public доступно по URL.
app.use(express.static(publicDir));

// 1. Самый простой маршрут Express.
app.get("/hello", (req, res) => {
    res.send("<h1>Hello Express!</h1><p>Это первый маршрут Express.</p><a href='/'>← На главную</a>");
});

// 5. Маршрутизация: каждый URL имеет свой обработчик.
app.get("/about", (req, res) => {
    res.send("<h1>О сайте</h1><p>Это пример маршрута /about.</p><a href='/'>На главную</a>");
});

app.get("/contact", (req, res) => {
    res.send("<h1>Контакты</h1><p>Email: student@example.com</p><a href='/'>На главную</a>");
});

// 2. Middleware-цепочка: первая функция передаёт запрос следующей через next().
app.get("/middleware-demo",
    (req, res, next) => {
        console.log("Middleware demo 1: запрос получен");
        next();
    },
    (req, res, next) => {
        console.log("Middleware demo 2: продолжаем обработку");
        next();
    },
    (req, res) => {
        res.send("<h1>Middleware работает</h1><p>В терминале видны два сообщения. Глобальный middleware также записал запрос в server.log.</p><a href='/'>На главную</a>");
    }
);

// 3. Отправка ответа: обычный текст/HTML.
app.get("/response", (req, res) => {
    res.send("<h2>Hello from response.send()</h2><p>Метод send отправил HTML-ответ.</p><a href='/'>На главную</a>");
});

// 3. Отправка JSON-ответа.
app.get("/response/json", (req, res) => {
    res.json({ message: "Hello JSON", course: "Express" });
});

// 3. Отправка файла.
app.get("/response/file", (req, res) => {
    res.sendFile(path.join(publicDir, "about.html"));
});

// 3. Пример ответа со статусом 404.
app.get("/response/404", (req, res) => {
    res.status(404).send("404: Resource not found (пример статуса)");
});

// 6. Переадресация: браузер перенаправляется на /about.
app.get("/redirect", (req, res) => {
    res.redirect("/about");
});

// 7. Query-параметры: читаем значения после знака ?.
app.get("/query", (req, res) => {
    res.json({
        id: req.query.id ?? null,
        name: req.query.name ?? null
    });
});

// 9. Параметр маршрута: значение берётся из URL /products/10.
app.get("/products/:productId", (req, res) => {
    res.send(`<h1>Параметр маршрута</h1><p>Product ID: ${escapeHtml(req.params.productId)}</p><a href='/'>На главную</a>`);
});

// 10. Router: связанные маршруты продуктов собраны в одном месте.
const productRouter = express.Router();

productRouter.get("/", (req, res) => {
    res.send("<h1>Список продуктов</h1><p>Router: главная страница продуктов.</p><a href='/router/products/create'>Добавить продукт</a> | <a href='/router/products/10'>Продукт 10</a> | <a href='/'>На главную</a>");
});

// /create ставим перед /:id, чтобы слово create не приняли за ID.
productRouter.get("/create", (req, res) => {
    res.send("<h1>Добавление продукта</h1><p>Это демонстрационный маршрут, продукт не сохраняется.</p><a href='/router/products'>К списку</a>");
});

productRouter.get("/:id", (req, res) => {
    res.send(`<h1>Продукт из Router</h1><p>ID продукта: ${escapeHtml(req.params.id)}</p><a href='/router/products'>К списку</a>`);
});

app.use("/router/products", productRouter);

// 8. GET для формы: показываем главную страницу с формой.
app.get("/form", (req, res) => {
    res.redirect("/#post-form");
});

// 8. POST и HTML-форма: application/x-www-form-urlencoded.
app.post("/form", (req, res) => {
    const name = String(req.body.userName ?? "").trim();
    const age = String(req.body.userAge ?? "").trim();

    if (!name || !age) {
        return res.status(400).send("Нужно заполнить имя и возраст. <a href='/#post-form'>Вернуться к форме</a>");
    }

    res.send(`<h1>Форма получена</h1><p>Имя: ${escapeHtml(name)}</p><p>Возраст: ${escapeHtml(age)}</p><a href='/#post-form'>Вернуться к форме</a>`);
});

// 11. JSON и AJAX: принимаем JSON и возвращаем JSON.
app.post("/user", (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const age = String(req.body?.age ?? "").trim();

    if (!name || !age) {
        return res.status(400).json({ message: "Пожалуйста, введите имя и возраст." });
    }

    res.json({ message: `Сервер получил: ${name}, возраст ${age}` });
});

// 12. Handlebars: обычное представление с данными.
app.get("/hbs", (req, res) => {
    res.render("handlebars/contact-basic.hbs", {
        layout: false,
        title: "Мои контакты",
        email: "student@example.com",
        phone: "+7 700 000 00 00"
    });
});

// 13. Handlebars partials: подключаем общее меню и footer.
app.get("/hbs/partials", (req, res) => {
    res.render("handlebars/contact-partials.hbs", {
        layout: false,
        title: "Контакты с partials",
        email: "student@example.com",
        phone: "+7 700 000 00 00"
    });
});

// 14. Handlebars layout: используем общий макет main.hbs.
app.get("/hbs/layout", (req, res) => {
    res.render("handlebars/contact-layout.hbs", {
        layout: "main",
        title: "Мои контакты",
        email: "student@example.com",
        phone: "+7 700 000 00 00"
    });
});

// 15. Handlebars helpers: getTime и createStringList.
app.get("/hbs/helpers", (req, res) => {
    res.render("handlebars/home.hbs", {
        layout: "main",
        title: "Handlebars Helpers",
        fruits: ["Apple", "Lemon", "Banana", "Grape"]
    });
});

// 16. EJS: представление с условием, циклом и partials.
app.get("/ejs/contact", (req, res) => {
    res.render("ejs/contact.ejs", {
        title: "Мои контакты — EJS",
        emailsVisible: true,
        emails: ["student@example.com", "support@example.com"],
        phone: "+7 700 000 00 00"
    });
});

// 17. Pug: простое представление.
app.get("/pug/contact", (req, res) => {
    res.render("pug/simple.pug", {
        title: "Мои контакты — Pug",
        emailsVisible: true,
        emails: ["student@example.com", "support@example.com"],
        phone: "+7 700 000 00 00"
    });
});

// 18. Pug partials и layout: тот же пример использует общий layout и footer.
app.get("/pug/layout", (req, res) => {
    res.render("pug/contact.pug", {
        title: "Контакты с Pug layout",
        emailsVisible: true,
        emails: ["student@example.com", "support@example.com"],
        phone: "+7 700 000 00 00"
    });
});

// 19. REST API: временный массив пользователей вместо базы данных.
const users = [];

// Получить всех пользователей.
app.get("/api/users", (req, res) => {
    res.json(users);
});

// Получить одного пользователя по ID.
app.get("/api/users/:id", (req, res) => {
    const user = users.find((item) => item.id === req.params.id);
    if (user) return res.json(user);
    res.status(404).json({ message: "Пользователь не найден" });
});

// Добавить пользователя.
app.post("/api/users", (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const age = Number(req.body?.age);

    if (!name || !Number.isInteger(age) || age < 1) {
        return res.status(400).json({ message: "Введите имя и корректный возраст." });
    }

    const user = { id: crypto.randomUUID(), name, age };
    users.push(user);
    res.status(201).json(user);
});

// Изменить пользователя по ID, указанному в JSON-теле.
app.put("/api/users", (req, res) => {
    const id = String(req.body?.id ?? "");
    const name = String(req.body?.name ?? "").trim();
    const age = Number(req.body?.age);

    if (!id || !name || !Number.isInteger(age) || age < 1) {
        return res.status(400).json({ message: "Нужны ID, имя и корректный возраст." });
    }

    const user = users.find((item) => item.id === id);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    user.name = name;
    user.age = age;
    res.json(user);
});

// Удалить пользователя по ID.
app.delete("/api/users/:id", (req, res) => {
    const index = users.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Пользователь не найден" });

    const deletedUser = users.splice(index, 1)[0];
    res.json(deletedUser);
});

// Последний обработчик: если ни один маршрут не подошёл, отправляем 404.
app.use((req, res) => {
    res.status(404).send("404: Страница не найдена. <a href='/'>На главную</a>");
});

// 1. Запускаем сервер на порту 3000.
app.listen(PORT, () => {
    console.log(`Express работает: http://localhost:${PORT}`);
});

