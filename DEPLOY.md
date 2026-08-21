# Как открыть сайт по ссылке, а не из папки

Постоянную ссылку даёт Vercel. Папку с файлами он берёт из GitHub, поэтому порядок такой.

## Один раз

1. Залейте папку `design/` в репозиторий **elenaisanewleet/furniture-detal**, ветка `main`.
   Через Claude Code: «залей содержимое design/ в furniture-detal, ветка main».
   Вручную: github.com → репозиторий → **Add file → Upload files** → перетащить все файлы из
   `design/` → **Commit**.
2. vercel.com → **Add New → Project** → **Import Git Repository** → выбрать `furniture-detal`.
3. Framework Preset: **Other**. Build Command — пусто. Output Directory — пусто (или папка, в
   которую залили файлы). **Deploy**.
4. Через минуту Vercel выдаёт ссылку вида `furniture-detal.vercel.app` — её можно открыть с любого
   телефона и отправить кому угодно.

Сборки нет: это обычные HTML, CSS и JS. Vercel просто раздаёт файлы.

## Дальше

Каждый новый коммит в `main` обновляет сайт сам. Отдельно деплоить не нужно.

## Свой домен

Vercel → проект → **Settings → Domains** → добавить домен → прописать у регистратора записи,
которые покажет Vercel. После этого в `sitemap.xml` и во всех `canonical` заменить
`furniture-detal.vercel.app` на новый адрес — иначе поиск будет считать главной старую версию.

## Что не работает без бэкенда

Заявка сейчас уходит в WhatsApp или Telegram через ссылку, а голосовое сообщение остаётся
на устройстве клиента. Чтобы заявки приходили в бота и сохранялись, нужна serverless-функция
на Vercel — это отдельная задача, она описана в `PROMPT.md`, пункт 3.
