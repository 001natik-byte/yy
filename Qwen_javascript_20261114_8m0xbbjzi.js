function calculatePasswordStrength(password) {
    // 1. Определяем размер алфавита
    let alphabetSize = 0;
    
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigits = /[0-9]/.test(password);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);
    
    if (hasLowercase) alphabetSize += 26;
    if (hasUppercase) alphabetSize += 26;
    if (hasDigits) alphabetSize += 10;
    if (hasSpecialChars) alphabetSize += 32; // основные спецсимволы
    
    // Если пароль пустой, возвращаем минимальные значения
    if (password.length === 0 || alphabetSize === 0) {
        return {
            entropy: 0,
            crackTimeSeconds: 0,
            crackTimeFormatted: '0 секунд',
            strengthLevel: 'слабый'
        };
    }
    
    // 2. Рассчитываем энтропию в битах: E = L * log2(N)
    // где L - длина пароля, N - размер алфавита
    const entropy = password.length * Math.log2(alphabetSize);
    
    // 3. Рассчитываем время взлома при скорости 10 млрд переборов/сек
    const guessesPerSecond = 10_000_000_000; // 10^10
    const totalCombinations = Math.pow(2, entropy);
    const crackTimeSeconds = totalCombinations / guessesPerSecond;
    
    // Форматируем время взлома
    const crackTimeFormatted = formatCrackTime(crackTimeSeconds);
    
    // 4. Определяем уровень сложности
    let strengthLevel;
    if (entropy < 28) {
        strengthLevel = 'слабый';
    } else if (entropy < 50) {
        strengthLevel = 'средний';
    } else {
        strengthLevel = 'сильный';
    }
    
    return {
        entropy: parseFloat(entropy.toFixed(2)),
        crackTimeSeconds: crackTimeSeconds,
        crackTimeFormatted: crackTimeFormatted,
        strengthLevel: strengthLevel
    };
}

// Вспомогательная функция для форматирования времени
function formatCrackTime(seconds) {
    if (seconds < 1) {
        return 'менее секунды';
    } else if (seconds < 60) {
        return `${Math.floor(seconds)} секунд`;
    } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)} минут`;
    } else if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)} часов`;
    } else if (seconds < 31536000) {
        return `${Math.floor(seconds / 86400)} дней`;
    } else if (seconds < 3153600000) {
        return `${Math.floor(seconds / 31536000)} лет`;
    } else {
        return 'тысячелетия';
    }
}