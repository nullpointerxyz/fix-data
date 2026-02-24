document.addEventListener('DOMContentLoaded', () => {
    const tsInput = document.getElementById('ts-input');
    const tsOutput = document.getElementById('ts-output');
    const tsTransformBtn = document.getElementById('ts-transform-btn');

    tsTransformBtn.addEventListener('click', () => {
        const text = tsInput.value.trim();
        if (!text) {
            tsOutput.value = '';
            return;
        }
        try {
            const result = parseToString(text);
            tsOutput.value = JSON.stringify(result, null, 2);
        } catch (e) {
            tsOutput.value = '解析失败: ' + e.message;
        }
    });

    /**
     * 解析 Java toString 输出为 JS 对象
     * 支持：ClassName(k=v) / ClassName{k=v} / ClassName[k=v] / 纯 k=v
     */
    function parseToString(input) {
        input = input.trim();
        const wrapperMatch = input.match(/^(\w+)\s*([(\[{])([\s\S]*)[)\]}]$/);
        if (wrapperMatch) {
            return parseKeyValuePairs(wrapperMatch[3]);
        }
        if (input.includes('=')) {
            return parseKeyValuePairs(input);
        }
        return input;
    }

    function parseKeyValuePairs(content) {
        const result = {};
        const pairs = splitTopLevel(content, ',');
        for (const pair of pairs) {
            const trimmed = pair.trim();
            if (!trimmed) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;
            const key = trimmed.substring(0, eqIdx).trim();
            const rawValue = trimmed.substring(eqIdx + 1).trim();
            result[key] = parseValue(rawValue);
        }
        return result;
    }

    function parseValue(val) {
        if (val === 'null') return null;
        if (val === 'true') return true;
        if (val === 'false') return false;
        if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);

        // 嵌套对象 ClassName(...)
        const objMatch = val.match(/^(\w+)\s*\(([\s\S]*)\)$/);
        if (objMatch) return parseKeyValuePairs(objMatch[2]);

        // 嵌套对象 ClassName{...}
        const objMatch2 = val.match(/^(\w+)\s*\{([\s\S]*)\}$/);
        if (objMatch2) return parseKeyValuePairs(objMatch2[2]);

        // 数组 [item1, item2]
        if (val.startsWith('[') && val.endsWith(']')) {
            const inner = val.substring(1, val.length - 1).trim();
            if (inner === '') return [];
            const items = splitTopLevel(inner, ',');
            return items.map(item => parseValue(item.trim()));
        }

        return val;
    }

    /**
     * 在顶层按分隔符拆分，忽略括号内的分隔符
     */
    function splitTopLevel(str, delimiter) {
        const result = [];
        let depth = 0;
        let current = '';
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            if (ch === '(' || ch === '[' || ch === '{') {
                depth++;
                current += ch;
            } else if (ch === ')' || ch === ']' || ch === '}') {
                depth--;
                current += ch;
            } else if (ch === delimiter && depth === 0) {
                result.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        if (current.trim()) result.push(current);
        return result;
    }
});
