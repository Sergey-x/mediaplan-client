import refresh from "./crud/refresh";
import { ACCESS_TOKEN_STORAGE_NAME, SERVER_ORIGIN } from "./config";
import checkOptions from "./utils/checkOptions";
import { API } from "./api";

const BASE_URL = SERVER_ORIGIN;

/**
 * Максимальное количество попыток запроса, если ответ с 5** или ошибка
 * */
const MaxRequestAttempts: number = 3;

class APIRequestError {
    private message: string;
    private details: object;
    private status: number;
    private name: string;

    constructor(message: string, details: object, status: number) {
        this.message = message;
        this.details = details;
        this.status = status;
        this.name = `Ошибка обращения к ${BASE_URL} API`;
    }
}

/**
 * По умолчанию будет добавлен Content-Type: application/json
 *
 * @param {string} requestUrl
 * @param {Object} [fetchOptions]
 * @param {Object} [additionalHeaders]
 * @returns {Object}
 */
const makeRequest = async (
    requestUrl: string,
    fetchOptions: object = {},
    additionalHeaders: object = {}
): Promise<any> => {
    // Если запрос на аутентификацию, он не требует токена
    const isAuthentication = requestUrl.includes(API.auth.baseUrl) || requestUrl.includes(API.auth.regUrl);
    const authHeader = isAuthentication
        ? {}
        : (() => {
              const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_NAME);
              if (!accessToken) return;
              return {
                  Authorization: `Bearer ${accessToken}`,
              };
          })();

    async function makeAttempt() {
        return await fetch(`${BASE_URL}${requestUrl}`, {
            ...fetchOptions,
            headers: {
                ...additionalHeaders,
                ...authHeader,
            },
        });
    }

    for (let requestAttempt = 0; requestAttempt < MaxRequestAttempts; requestAttempt++) {
        // поптыка выполнить запрос
        let response = null;
        try {
            response = await makeAttempt();
        } catch (e) {
            if (requestAttempt === MaxRequestAttempts - 1) {
                throw e;
            }
            continue;
        }

        // условия для повторной поптыки
        if (response.status >= 500) {
            continue;
        }

        if (response.status === 401 && !isAuthentication) {
            const makeRequestAgain = () => makeRequest(requestUrl, fetchOptions, additionalHeaders);
            const refreshResult: boolean = await refresh(() => {
                localStorage.clear();
                window.location.replace("/");
            });
            if (refreshResult) {
                return makeRequestAgain();
            } else {
                localStorage.clear();
                window.location.pathname = "/";
            }
        }
        const payload = response.status !== 204 ? await response.json() : undefined;
        if (!response.ok) throw new APIRequestError("Неизвестная ошибка", payload, response.status);
        return payload;
    }
    throw new APIRequestError("Ошибка обращения к серверу", {}, 502);
};

const requestApi = {
    GET: (path: string, fetchOptions: object = {}) => {
        return makeRequest(
            path,
            {
                method: "GET",
                ...checkOptions(fetchOptions),
            },
            {
                "Content-Type": "application/json",
            }
        );
    },
    POST: (path: string, fetchOptions: object = {}) => {
        return makeRequest(
            path,
            {
                method: "POST",
                ...checkOptions(fetchOptions),
            },
            {
                "Content-Type": "application/json",
            }
        );
    },
    POST_FILE: (path: string, fetchOptions: object = {}) => {
        return makeRequest(path, {
            method: "POST",
            ...fetchOptions,
        });
    },
    PUT: (path: string, fetchOptions: object = {}) => {
        return makeRequest(
            path,
            {
                method: "PUT",
                ...checkOptions(fetchOptions),
            },
            {
                "Content-Type": "application/json",
            }
        );
    },
    PATCH: (path: string, fetchOptions: object = {}) => {
        return makeRequest(
            path,
            {
                method: "PATCH",
                ...checkOptions(fetchOptions),
            },
            {
                "Content-Type": "application/json",
            }
        );
    },
    DELETE: (path: string, fetchOptions: object = {}) => {
        return makeRequest(
            path,
            {
                method: "DELETE",
                ...checkOptions(fetchOptions),
            },
            {
                "Content-Type": "application/json",
            }
        );
    },
};

export default requestApi;
