import env from "../core/env"

export const commandNames = {
    //steps
    chooseSeat: '/chooseSeat',
    chooseDate: '/chooseDate',
    chooseDuration: '/chooseDuration',
    // default
    start: '/start',
    help: '/help',
    // core commands
    createReservation: '/create',
    activeReservations: '/active',
    cancelReservation: '/cancel',
    // activeReservations: '/activeReservations',
    // createReservation: '/createReservation'
    approveReservation: '/approveReservation',
}

export const chosedSeatCallbackPartial = '/choosedSeat'

export const cancelReservationCallbackPartial = '/cancel'


export const valueAlreadySet = {
    duration: "Продолжительность уже выбрана.",
    seat: "Место уже выбрано уже выбрано.",
    date: "Дата уже выбрано уже выбрана."
}

export const step1Responses = {
    tooManyReservations: 'Извините, но у вас слишком много активных резерваций',
    success: `Добро пожаловать! Для начала новой брони у тебя есть несколько вариантов`
    // success: `Добро пожаловать! Для начала новой брони у тебя есть несколько вариантов:\n
    // \t1. Выбери команду ${commandNames.chooseSeat}, чтобы указать место для резервации.\n
    // \t2. Выбери команду ${commandNames.chooseDate}, чтобы установить дату бронирования.\n
    // \t3. Выбери команду ${commandNames.chooseDuration}, чтобы указать продолжительность бронирования.\n
    // \nИли используй /help, чтобы получить дополнительную информацию. Удачи! 🌟`,
}

export const expectAnoutherValue = {
    expectSeat: 'Видимо, вы ошиблись. Ожидалось, что вы выберете место используя кнопки выше 👆',
    expectDate: 'Видимо, вы ошиблись. Ожидалось, что вы введете дату',
    expectDuration: 'Видимо, вы ошиблись. Ожидалось, что вы введете продолжительность'
}

export const cancelReservationResponses = {
    reservationCanceled: 'Вы успешно отменили резервацию!💥',
    reservationsNotFound: `Мы не нашли ваших резерваций.\nИспользуйте команду ${commandNames.createReservation} что бы создать первую.`,
    selectedReservationNotFound: `Что-то пошло не так, мы не смогли найти эту резервацию. Поробуйте еще раз`,
    reservationTooClose: `Резервация слишком близко к сегодняшней дате, для отмены свяжитесь с администратором - https://t.me/focixuxp`
}

export const step4Responses = {
    closeTimeExceeded: `Извините, мо максильманое время на бронирования - ${env.maxReservationFromHour - 1}:30.`,
    _dateRule: 'Вы не можете выбрать дату более чем на неделю вперед.',
    _minutesRule: `Минуты в дате должно быть или 30 или 00.\n\t\tПример: 15:30; 16:00.`,
    _dateTimeFormatRule: `Дата должна быть в одном из двух форматов: День.Месяц.год часы:минуты или День/Месяц/год часы:минуты\n\t\tПример: 05.04.2024 15:30`,
    get successCommand() {
        return `
        Отлично! Теперь нужно выбрать желаемую дату бронирования.\nПожалуйста, учти следующие правила:
        \t1. ${this._dateTimeFormatRule}\n
        \t2. ${this._dateRule}\n
        \t3. ${this._minutesRule}
    `
    },
    success: 'Замечательно! Время установлено.',

    get dateTooFarInFuture(){
        return `
        Кажется вы ошиблись в формате даты. Попробуйте еще раз.
        ${this._dateRule}
    `
    },
    get invalidMinutes(){
        return `
            Кажется вы ошиблись в формате минут в дате. Попробуйте еще раз.\n
            ${this._minutesRule}
            \t\tНеправильно: 15:31; 16:42
        `
    },
    get invalidDateTimeFormat(){
        return `
            Кажется вы ошиблись в формате даты. Попробуйте еще раз.\n
            ${this._dateTimeFormatRule}
        `  
    }

}

export const step3Responses = {
    get successCommand(){
        return `
        Отлично! Теперь выбери продолжительность бронирования. Пожалуйста, учти следующие правила:\n
        \t1. Длительность должна быть больше чем 30 минут.\n
        \t2. Длительность должна быть меньше чем 12 часов.\n
        \t3. Шаг длительности - 30 минут (например, 0:30, 1:00, 1:30 и так далее).\n\n
        ${this._validExamples}\n
        Примеры невалидных значений: 0:20, 2:31, 5:15.`
    },
    _validExamples: 'Примеры валидных значений: 1:30, 2:00, 4:30.',
    success: 'Отлично! Продолжительность выбрана.',
    get invalidDuration(){
        return  `Неправильный формат продолжительности.\n${this._validExamples}`
    }
}

export const step2Responses = {
    successCommand: 'Отлично! Давайте выберем место. Вот список всех мест:\n',
    freeSeatNotFound: 'У нас не получилось найти свободное место в указанное вами время.\nПожалуйста, пройдите резервацию заново и укажите другое время.',
    seatNotFound: `Возможно вы ошиблись. Но такого места не существует. Попробуйте еще раз`,
    success: 'Супер, вы выбрали место!'
}

export const activeReservationsResponse = {
    listOfReservations: 'Вот все ваши активные резервации\n',
    noActiveReservations: `У вас пока что нету активных резерваций. Что бы создать резервацию используйте команду ${commandNames.createReservation}`
}

export const nextStepMessages = {
    pickDate: `Вы можете выбрать желаемую дату используя команду ${commandNames.chooseDate}\n`,
    pickSeat: `Вы можете выбрать желаемое место используя команду ${commandNames.chooseSeat}}\n`,
    pickDuration: `Вы можете выбрать продолжительность резервации используя команду ${commandNames.chooseDuration}\n`,
    noStepsLeft: `Осталось лишь подтвердить вашу резервацию.\nДанные о резервации: `
    // noStepsLeft: `Осталось лишь подтвердить вашу резервацию. Для этого используйте команду ${commandNames.approveReservation}\nДанные о резервации: `
}

export const responseMessages = {
    help: `
    Вы можете использовать одну из следующих команд:
    - /help
    - ${commandNames.createReservation}
    `,
    invalidDateTimeFormat: `
        Кажется вы ошиблись в формате даты. Попробуйте еще раз.
        Дата должна быть в одном из двух форматов: День.Месяц.год часы:минуты или День/Месяц/год часы:минуты
            Пример: 05.04.2024 15:30
    `,
    dateTooFarInFuture: `
        Кажется вы ошиблись в формате даты. Попробуйте еще раз.
        Дата не должна быть дальше чем 7 дней.
    `,
    reservationNotFound: `
        Извините, но мы не нашли активную резервацию. Пожалуйста, используйте команду ${commandNames.createReservation} для создания активной резервации
    `,
    reservationFinished: `
    Поздавляем. Ваша резервация успешно создана. Используйте команду ${commandNames.activeReservations} что бы посмотреть данные об активных резервациях.
    `,
    sameReservationFinished: `
        Простите, но кажется кто-то уже занял это место. Пожалуйста, пройдите резервацию снова используя команду ${commandNames.createReservation}
    `,
    unknownMessage: `Извините, но я не смог разобрать ваше сообщение. Пожайлуйста`,
    reservationNotReadyForApprove: `Извините, но ваша резервация не готова к подтерженю.`

}
export const startMessage = `Привет! Я бот который поможет тебе зарезервировать место в компюторном клубе MissClick 🤘!\n${responseMessages.help}`
