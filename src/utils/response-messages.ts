export const responseMessages = {
    createReservationStep1: `
    Добро пожаловать! Для начала новой брони у тебя есть несколько вариантов:
    1. Выбери команду /choose-seat, чтобы указать место для резервации.
    2. Выбери команду /choose-date, чтобы установить дату бронирования.
    3. Выбери команду /choose-duration, чтобы указать продолжительность бронирования.
    
    Или используй /help, чтобы получить дополнительную информацию. Удачи! 🌟
    `,
    selectDuration: `
        Отлично! Теперь выбери продолжительность бронирования. Пожалуйста, учти следующие правила:

        - Длительность должна быть больше чем 30 минут.
        - Длительность должна быть меньше чем 12 часов.
        - Шаг длительности - 30 минут (например, 0:30, 1:00, 1:30 и так далее).
        
        Примеры валидных значений: 1:30, 2:00, 4:30.
        
        Примеры невалидных значений: 0:20, 2:31, 5:15.
    `,
    help: `
    Вы можете использовать одну из следующих команд:
    - /help
    - /create-reservation
    `,
    selectDate: `
        Отлично! Теперь нужно выбрать желаемую дату бронирования. Пожалуйста, учти следующие правила:

        - Дата должна быть в одном из двух форматов: День.Месяц.год часы:минуты или День/Месяц/год часы:минуты
            Пример: 05.04.2024 15:30
        - Вы не можете выбрать дату более чем на неделю вперед.
        - Минуты в дате должно быть или 30 или 00.
            Пример: 15:30; 16:00.
    `,
    invalidDateTimeFormat: `
        Кажется вы ошиблись в формате даты. Попробуйте еще раз.
        Дата должна быть в одном из двух форматов: День.Месяц.год часы:минуты или День/Месяц/год часы:минуты
            Пример: 05.04.2024 15:30
    `,
    invalidMinutes:`
        Кажется вы ошиблись в формате минут в дате. Попробуйте еще раз.
        Время в дате должно быть или 30 или 00.
            Правильно: 15:30; 16:00.
            Неправильно: 15:31; 16:42

    `,
    dateTooFarInFuture: `
        Кажется вы ошиблись в формате даты. Попробуйте еще раз.
        Дата не должна быть дальше чем 7 дней.
    `,
    failTryAgain:`
        У нас не получилось найти свободное место в указанное вами время. Пожалуйста, пройдите резервацию заново и укажите другое время.
    `

}