document.addEventListener('app-components-loaded', () => {
    const stampInput = document.getElementById('ts-stamp-input');
    const tsResult = document.getElementById('ts-result');
    const convertBtn = document.getElementById('ts-convert-btn');
    const reverseBtn = document.getElementById('ts-reverse-btn');
    const customFormatInput = document.getElementById('ts-custom-format');
    const unitRadios = document.getElementsByName('ts-unit');
    const formatRadios = document.getElementsByName('ts-format');
    const nowMs = document.getElementById('ts-now-ms');
    const nowS = document.getElementById('ts-now-s');

    // 实时显示当前时间戳
    setInterval(() => {
        const now = Date.now();
        nowMs.textContent = now;
        nowS.textContent = Math.floor(now / 1000);
    }, 1000);

    // 自定义格式输入框联动
    formatRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            customFormatInput.disabled = radio.value !== 'custom' || !radio.checked;
        });
    });

    function getSelectedUnit() {
        for (const r of unitRadios) {
            if (r.checked) return r.value;
        }
        return 'auto';
    }

    function getSelectedFormat() {
        for (const r of formatRadios) {
            if (r.checked) {
                if (r.value === 'custom') return customFormatInput.value || 'yyyy-MM-dd HH:mm:ss';
                return r.value;
            }
        }
        return 'yyyy-MM-dd HH:mm:ss';
    }

    /**
     * 时间戳 → 日期
     */
    convertBtn.addEventListener('click', () => {
        const raw = stampInput.value.trim();
        if (!raw) { tsResult.value = ''; return; }

        const num = Number(raw);
        if (isNaN(num)) {
            tsResult.value = '❌ 无效的时间戳';
            return;
        }

        let ms;
        const unit = getSelectedUnit();
        if (unit === 'ms') {
            ms = num;
        } else if (unit === 's') {
            ms = num * 1000;
        } else {
            // 自动识别：13位为毫秒，10位为秒
            ms = raw.length <= 10 ? num * 1000 : num;
        }

        const date = new Date(ms);
        if (isNaN(date.getTime())) {
            tsResult.value = '❌ 无效的时间戳';
            return;
        }

        const fmt = getSelectedFormat();
        const formatted = formatDate(date, fmt);

        const lines = [];
        lines.push('日期: ' + formatted);
        lines.push('毫秒: ' + ms);
        lines.push('秒:   ' + Math.floor(ms / 1000));
        lines.push('ISO:  ' + date.toISOString());
        tsResult.value = lines.join('\n');
    });

    /**
     * 日期 → 时间戳（反向转换）
     */
    reverseBtn.addEventListener('click', () => {
        const raw = stampInput.value.trim();
        if (!raw) { tsResult.value = ''; return; }

        const date = new Date(raw);
        if (isNaN(date.getTime())) {
            tsResult.value = '❌ 无法解析日期，支持格式如:\n2024-02-12 18:00:00\n2024/02/12 18:00:00\n2024-02-12T18:00:00+08:00';
            return;
        }

        const ms = date.getTime();
        const lines = [];
        lines.push('毫秒: ' + ms);
        lines.push('秒:   ' + Math.floor(ms / 1000));
        lines.push('ISO:  ' + date.toISOString());
        tsResult.value = lines.join('\n');
    });

    /**
     * 按格式模板输出日期
     * 支持：yyyy, MM, dd, HH, mm, ss, SSS
     */
    function formatDate(date, fmt) {
        const pad = (n, len) => String(n).padStart(len || 2, '0');
        const map = {
            'yyyy': date.getFullYear(),
            'MM': pad(date.getMonth() + 1),
            'dd': pad(date.getDate()),
            'HH': pad(date.getHours()),
            'mm': pad(date.getMinutes()),
            'ss': pad(date.getSeconds()),
            'SSS': pad(date.getMilliseconds(), 3)
        };
        let result = fmt;
        for (const [token, val] of Object.entries(map)) {
            result = result.replace(token, val);
        }
        return result;
    }
});
