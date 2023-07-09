export const MinPasswordLength: number = 6;

export const PasswordErrors = {
    PasswordsDontMatch: "Пароли не совпадают",
    PasswordsTooShort: `Пароль слишком короткий. Минимальная длина ${MinPasswordLength} символов`,
};

export const ServerAvailableErrors = {
    ServiceUnavailable: "Сервис недоступен, попробуйте позже",
};
