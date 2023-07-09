import requestApi from "../fetchApi";
import { ACCESS_TOKEN_STORAGE_NAME, REFRESH_TOKEN_STORAGE_NAME } from "../config";

/**
 * Хранит Promise на обновление пары токенов, чтобы разные запросы одновременно не обновляли токены
 */
let currentRequest: Promise<any> | null = null;

/**
 * Количество попыток на обновление пары токенов
 */
const REFRESH_RETRIES: number = 3;

/**
 * Создает новый Promise на обновление пары токенов
 */
function makeRefresh() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_NAME);
    return requestApi.POST(`/jwt/refresh`, {
        body: {
            token: refreshToken,
        },
    });
}

/**
 * Обновление токенов.
 *
 * Когда нужно обновить токен, проверяем, не обновляется ли он уже.
 * Если за несколько попыток обновить токен не удалось, то производим logout.
 */
const refresh = async (handleError: () => void): Promise<boolean> => {
    for (let retryNumber = 0; retryNumber < REFRESH_RETRIES; retryNumber++) {
        try {
            currentRequest = currentRequest || makeRefresh();
            const res = await currentRequest;
            localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, res.access);
            localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, res.refresh);
            return true;
        } catch (error) {
            if (retryNumber === REFRESH_RETRIES - 1) {
                handleError();
            }
        } finally {
            currentRequest = null;
        }
    }
    currentRequest = null;
    window.localStorage.clear();
    window.location.pathname = "/";
    return false;
};

export default refresh;
