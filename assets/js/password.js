document.addEventListener('app-components-loaded', () => {
    const pwUpper = document.getElementById('pw-upper');
    const pwLower = document.getElementById('pw-lower');
    const pwDigit = document.getElementById('pw-digit');
    const pwSymbol = document.getElementById('pw-symbol');
    const pwLength = document.getElementById('pw-length');
    const pwCount = document.getElementById('pw-count');
    const pwLenVal = document.getElementById('pw-len-val');
    const pwCountVal = document.getElementById('pw-count-val');
    const pwGenerateBtn = document.getElementById('pw-generate-btn');
    const pwOutput = document.getElementById('pw-output');

    const CHARS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const CHARS_DIGIT = '0123456789';
    const CHARS_SYMBOL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    pwLength.addEventListener('input', () => { pwLenVal.textContent = pwLength.value; });
    pwCount.addEventListener('input', () => { pwCountVal.textContent = pwCount.value; });

    pwGenerateBtn.addEventListener('click', () => {
        let pool = '';
        if (pwUpper.checked) pool += CHARS_UPPER;
        if (pwLower.checked) pool += CHARS_LOWER;
        if (pwDigit.checked) pool += CHARS_DIGIT;
        if (pwSymbol.checked) pool += CHARS_SYMBOL;

        if (!pool) {
            pwOutput.value = '❌ 请至少选择一种字符类型';
            return;
        }

        const len = parseInt(pwLength.value);
        const count = parseInt(pwCount.value);
        const passwords = [];

        for (let i = 0; i < count; i++) {
            let pw = '';
            const arr = new Uint32Array(len);
            crypto.getRandomValues(arr);
            for (let j = 0; j < len; j++) {
                pw += pool[arr[j] % pool.length];
            }
            passwords.push(pw);
        }

        pwOutput.value = passwords.join('\n');
    });
});
