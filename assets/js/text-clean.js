document.addEventListener('app-components-loaded', () => {
    const inputData = document.getElementById('input-data');
    const outputData = document.getElementById('output-data');
    const inputStats = document.getElementById('input-stats');
    const outputStats = document.getElementById('output-stats');
    const transformBtn = document.getElementById('transform-btn');

    const rmQuotes = document.getElementById('rm-quotes');
    const rmComma = document.getElementById('rm-comma');
    const rmSpace = document.getElementById('rm-space');
    const rmDedup = document.getElementById('rm-dedup');
    const rmEmpty = document.getElementById('rm-empty');
    const rmSort = document.getElementById('rm-sort');
    const rmOnlyNum = document.getElementById('rm-only-num');
    const rmCustom = document.getElementById('rm-custom');
    const customChars = document.getElementById('custom-chars');

    const splitModes = document.getElementsByName('split-mode');
    const splitCustomChar = document.getElementById('split-custom-char');
    const outputFormats = document.getElementsByName('output-format');

    // 自定义分隔符联动
    splitModes.forEach(radio => {
        radio.addEventListener('change', () => {
            splitCustomChar.disabled = radio.value !== 'custom' || !radio.checked;
        });
    });

    inputData.addEventListener('input', () => {
        const text = inputData.value;
        const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
        inputStats.textContent = `${lines} 行 | ${text.length} 字符`;
    });

    transformBtn.addEventListener('click', () => {
        let text = inputData.value;
        if (!text) {
            outputData.value = '';
            outputStats.textContent = '0 项';
            return;
        }

        // 清洗
        if (rmQuotes.checked) text = text.replace(/["'“”‘’]/g, '');
        if (rmComma.checked) text = text.replace(/[,，]/g, '');
        if (rmSpace.checked) text = text.replace(/ /g, '');
        if (rmOnlyNum.checked) {
            // 按行提取数字
            text = text.split(/\r\n|\r|\n/).map(line => {
                const nums = line.match(/\d+/g);
                return nums ? nums.join('') : '';
            }).join('\n');
        }
        if (rmCustom.checked && customChars.value) {
            for (let i = 0; i < customChars.value.length; i++) {
                const escaped = customChars.value[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                text = text.replace(new RegExp(escaped, 'g'), '');
            }
        }

        // 分割
        let splitMode = 'newline';
        for (const r of splitModes) {
            if (r.checked) { splitMode = r.value; break; }
        }

        let items;
        switch (splitMode) {
            case 'newline': items = text.split(/\r\n|\r|\n/); break;
            case 'comma': items = text.split(/[,，]/); break;
            case 'space': items = text.split(/\s+/); break;
            case 'tab': items = text.split(/\t/); break;
            case 'custom':
                const delim = splitCustomChar.value || ',';
                const escapedDelim = delim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                items = text.split(new RegExp(escapedDelim));
                break;
            default: items = [text];
        }

        items = items.map(item => item.trim());

        // 去空行
        if (rmEmpty.checked) {
            items = items.filter(item => item !== '');
        } else {
            items = items.filter(item => item !== '');
        }

        // 去重
        if (rmDedup.checked) {
            items = [...new Set(items)];
        }

        // 排序
        if (rmSort.checked) {
            items.sort((a, b) => {
                const na = Number(a), nb = Number(b);
                if (!isNaN(na) && !isNaN(nb)) return na - nb;
                return a.localeCompare(b, 'zh-CN');
            });
        }

        if (items.length === 0) {
            outputData.value = '';
            outputStats.textContent = '0 项';
            return;
        }

        // 输出格式
        let selectedFormat = 'sql-in';
        for (const radio of outputFormats) {
            if (radio.checked) { selectedFormat = radio.value; break; }
        }

        let result = '';
        switch (selectedFormat) {
            case 'sql-in':
                result = items.map(item => `'${item}'`).join(', ');
                break;
            case 'sql-in-full':
                result = 'IN (' + items.map(item => `'${item}'`).join(', ') + ')';
                break;
            case 'comma-ids':
                result = items.join(', ');
                break;
            case 'newline':
                result = items.join('\n');
                break;
            case 'json-array':
                result = JSON.stringify(items, null, 2);
                break;
            case 'pipe':
                result = items.join('|');
                break;
        }

        outputData.value = result;
        outputStats.textContent = `${items.length} 项`;
    });
});
