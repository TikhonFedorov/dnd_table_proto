# D&D Table Proto

D&D Table Proto — это прототип онлайн-стола для игры в Dungeons & Dragons. Проект объединяет React-фронтенд с Django-бэкендом, используя WebSocket для реального времени (перемещение токенов, чат, броски кубиков). Подходит для небольших игровых сессий с поддержкой сетки карты, чата и различных кубиков (d2, d4, d6, d8, d10, d12, d20, d100).

## Особенности
- Интерактивная карта с сеткой (20x15 ячеек по 40px).
- Перемещаемые токены с синхронизацией через WebSocket.
- Чат с выделением бросков кубиков (зелёный цвет).
- Поддержка бросков разных кубиков: d2, d4, d6, d8, d10, d12, d20, d100.
- Современный дизайн с закруглёнными углами, тенями и адаптивностью.

## Технологии
- **Frontend**: React, Axios, WebSocket API
- **Backend**: Django, Django Channels, Daphne, Redis
- **Стили**: CSS (вдохновлён Tailwind)
- **Сборка**: Node.js, npm