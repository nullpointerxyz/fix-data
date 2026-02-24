document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('idval-input');
    const allowSpaceCheckbox = document.getElementById('idval-allow-space');
    const allowCnCommaCheckbox = document.getElementById('idval-allow-cn-comma');
    const checkBtn = document.getElementById('idval-check-btn');
    const fixBtn = document.getElementById('idval-fix-btn');

    const reportStats = document.getElementById('idval-report-stats');
    const highlightArea = document.getElementById('idval-highlight-area');
    const errorList = document.getElementById('idval-error-list');

    // Escaper function for HTML
    function escapeHtml(unsafe) {
        return (unsafe || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function validateIds() {
        const text = inputArea.value;
        if (!text) {
            reportStats.innerHTML = '输入为空，请先输入内容。';
            highlightArea.innerHTML = '<span style="color: var(--text-secondary);">分析的高亮诊断内容将显示在此处...</span>';
            errorList.innerHTML = '';
            return;
        }

        const allowSpace = allowSpaceCheckbox.checked;
        const allowCnComma = allowCnCommaCheckbox.checked;

        let totalItems = 0;
        let validItems = 0;
        let errors = [];

        // 正则表达式切割，保留分隔符。支持判断是用中文逗号还是英文逗号切割。
        const separatorRegex = allowCnComma ? /([,，])/ : /([,])/;
        const tokens = text.split(separatorRegex);

        let htmlOutput = '';
        let currentIdIndex = 1;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            // i 为奇数时是分隔符
            if (i % 2 !== 0) {
                if (token === '，' && !allowCnComma) {
                    htmlOutput += `<span style="background: rgba(255, 77, 79, 0.2); color: #ff4d4f; border-bottom: 2px dashed #ff4d4f; font-weight: bold;" title="不允许的中文逗号">${token}</span>`;
                    errors.push(`第 <strong>${currentIdIndex}</strong> 个位置后使用了不允许的中文逗号`);
                } else if (token === '，') {
                    // 允许中文逗号，但作为提示标记成黄色
                    htmlOutput += `<span style="background: rgba(250, 173, 20, 0.2); color: #faad14; font-weight: bold;" title="使用了中文逗号 (系统已兼容)">${token}</span>`;
                } else {
                    htmlOutput += `<span style="color: var(--text-disabled);">${token}</span>`; // 标准逗号
                }
                continue;
            }

            // 这个 token 是我们需要判断的具体值
            let preSpace = '';
            let postSpace = '';
            let coreValue = token;

            // 如果允许前后有空格或换行
            if (allowSpace) {
                const spaceMatch = token.match(/^(\s*)(.*?)(\s*)$/s);
                if (spaceMatch) {
                    preSpace = spaceMatch[1];
                    coreValue = spaceMatch[2];
                    postSpace = spaceMatch[3];
                }
            }

            // 处理完全为空的情况
            if (coreValue === '') {
                // 如果是首尾的空值可以静默忽略
                if (i !== 0 && i !== tokens.length - 1) {
                    htmlOutput += escapeHtml(preSpace) + `<span style="background: rgba(255, 77, 79, 0.2); color: #ff4d4f; border-bottom: 2px dashed #ff4d4f;" title="此处缺失ID (连续的多余逗号)">[空缺]</span>` + escapeHtml(postSpace);
                    errors.push(`检测到多余的连续逗号（值为空）`);
                } else {
                    htmlOutput += escapeHtml(token);
                }
            } else {
                totalItems++;
                const escapedCore = escapeHtml(coreValue);
                // 判断核心值是否为纯数字
                if (/^\d+$/.test(coreValue)) {
                    htmlOutput += escapeHtml(preSpace) + `<span style="color: var(--success); font-weight: 500;">${escapedCore}</span>` + escapeHtml(postSpace);
                    validItems++;
                } else {
                    // 有非数字字符混入
                    htmlOutput += escapeHtml(preSpace) + `<span style="background: rgba(255, 77, 79, 0.2); color: #ff4d4f; border-bottom: 2px dashed #ff4d4f; font-weight: bold;" title="包含非数字字符">${escapedCore}</span>` + escapeHtml(postSpace);
                    let limitedCore = coreValue.length > 15 ? coreValue.substring(0, 15) + '...' : coreValue;
                    errors.push(`第 <strong>${totalItems}</strong> 个 ID <code>"${escapeHtml(limitedCore)}"</code> 中包含非数字或不允许的特殊字符`);
                }
                currentIdIndex = totalItems;
            }
        }

        reportStats.innerHTML = `总共解析到 <strong>${totalItems}</strong> 个有效位，其中正常纯数字 ID 有 <strong style="color: var(--success);">${validItems}</strong> 个。`;
        highlightArea.innerHTML = htmlOutput;

        if (errors.length > 0) {
            let errorHtml = `<strong>发现 ${errors.length} 处异常格式 / 警告：</strong><ul style="margin-top: 8px; padding-left: 20px;">`;
            const limit = Math.min(errors.length, 30);
            for (let i = 0; i < limit; i++) {
                errorHtml += `<li style="margin-bottom: 4px;">${errors[i]}</li>`;
            }
            if (errors.length > 30) {
                errorHtml += `<li>...及其他 ${errors.length - 30} 处错误被折叠</li>`;
            }
            errorHtml += '</ul><div style="margin-top: 15px; color: var(--text-secondary); font-size: 0.85rem;">💡 提示：点击上方的 <strong>“自动清洗并提取数字”</strong>，可直接过滤所有非数字字符并输出标准的逗号拼接结果。</div>';
            errorList.innerHTML = errorHtml;
        } else if (totalItems > 0 && totalItems === validItems) {
            errorList.innerHTML = `<div style="padding: 10px; background: rgba(82, 196, 26, 0.1); border-left: 4px solid var(--success); border-radius: 4px;"><span style="color: var(--success); font-weight: bold;">🎉 校验通过！</span> <span style="color: var(--text-main)">您的 ID 格式完美，未发现任何多余字符。</span></div>`;
        } else {
            errorList.innerHTML = '';
        }
    }

    function fixIds() {
        const text = inputArea.value;
        if (!text) return;

        // 不论什么情况，把所有能匹配到的中英文字符逗号、换行等统一当成分隔标志
        const allowCnComma = allowCnCommaCheckbox.checked;
        const separatorRegex = allowCnComma ? /[,，\n]+/g : /[,\n]+/g;

        let tokens = text.split(separatorRegex);
        let validIds = [];

        for (let token of tokens) {
            // 利用正则剥离掉所有非数字内容（比如空格、字母、意外符号）
            let numbersOnly = token.replace(/\D/g, '');
            if (numbersOnly.length > 0) {
                validIds.push(numbersOnly);
            }
        }

        // 由于有极大的概率存在重复的查询ID，清洗时自动做了顺手去重
        const uniqueFixedArray = Array.from(new Set(validIds));

        inputArea.value = uniqueFixedArray.join(',');

        // 重新进行校验以显示绿色的成功反馈
        validateIds();
    }

    // 绑定事件
    checkBtn.addEventListener('click', validateIds);
    fixBtn.addEventListener('click', fixIds);

    // 监听实时输入变化 (如果文本巨大就不实时触发，这里加一个基于长度的简易防抖逻辑)
    let timeoutId;
    inputArea.addEventListener('input', () => {
        clearTimeout(timeoutId);
        // 如果长度很大，延迟大一点，保证不卡UI
        const delay = inputArea.value.length > 10000 ? 800 : 300;
        timeoutId = setTimeout(() => {
            if (inputArea.value.trim().length > 0) {
                validateIds();
            } else {
                reportStats.innerHTML = '等待输入内容并校验...';
                highlightArea.innerHTML = '<span style="color: var(--text-secondary);">分析的高亮诊断内容将显示在此处...</span>';
                errorList.innerHTML = '';
            }
        }, delay);
    });
});
