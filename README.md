# Лабораторная работа №5 — Express (19 тем)

## Запуск в VS Code (Windows)

Откройте эту папку в VS Code. В терминале выполните:

```powershell
npm.cmd install
npm.cmd start
```

Откройте http://localhost:3000

Остановка сервера: `Ctrl + C`.

## Где что находится

- `app.js` — основной сервер. Внутри комментарии обозначают темы.
- `public/index.html` — главная страница-каталог, ссылки, POST-форма, JSON/AJAX и интерфейс REST API.
- `public/about.html` — пример статического HTML-файла.
- `views/handlebars/` — основной Handlebars-шаблон, partials, layout и helpers.
- `views/ejs/` — EJS-шаблон и подключаемые partials.
- `views/pug/` — Pug-шаблон, footer и layout.
- `server.log` — создаётся автоматически и получает записи о запросах.

## 19 тем и адреса для проверки

1. Начало работы с Express — `/hello`
2. Middleware — `/middleware-demo`
3. Отправка ответа — `/response`, `/response/json`, `/response/file`, `/response/404`
4. Статические файлы — `/about.html`
5. Маршрутизация — `/about`, `/contact`
6. Переадресация — `/redirect`
7. Query-параметры — `/query?id=3&name=Tom`
8. POST-форма — форма на главной странице, обработчик `/form`
9. Параметры маршрута — `/products/10`
10. Router — `/router/products`, `/router/products/create`, `/router/products/10`
11. JSON и AJAX — форма JSON на главной странице, обработчик `/user`
12. Handlebars — `/hbs`
13. Handlebars partials — `/hbs/partials`
14. Handlebars layout — `/hbs/layout`
15. Handlebars helpers — `/hbs/helpers`
16. EJS — `/ejs/contact`
17. Pug — `/pug/contact`
18. Pug partials/layout — `/pug/layout`
19. REST API — интерфейс на главной странице; endpoints: `/api/users`, `/api/users/:id`

## Важно

REST API хранит пользователей во временном массиве в оперативной памяти, а не в базе данных. После перезапуска сервера массив снова будет пустым. Этот проект предназначен для учебной демонстрации тем Express.

