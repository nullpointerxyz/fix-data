document.addEventListener('app-components-loaded', () => {
    const fjInput = document.getElementById('fj-input');
    const fjOutput = document.getElementById('fj-output');
    const formToJsonBtn = document.getElementById('form-to-json-btn');
    const jsonToFormBtn = document.getElementById('json-to-form-btn');

    // From UrlEncoded Form to JSON
    formToJsonBtn.addEventListener('click', () => {
        let text = fjInput.value.trim();
        if (!text) { fjOutput.value = ''; return; }

        try {
            // 解析时，如果有 ? 开头，去除一下
            if (text.startsWith('?')) {
                text = text.substring(1);
            }

            const params = new URLSearchParams(text);
            const obj = {};
            for (const [key, value] of params.entries()) {
                if (obj[key] !== undefined) {
                    if (!Array.isArray(obj[key])) {
                        obj[key] = [obj[key]];
                    }
                    obj[key].push(value);
                } else {
                    obj[key] = value;
                }
            }
            fjOutput.value = JSON.stringify(obj, null, 2);
        } catch (e) {
            fjOutput.value = '❌ 解析表单参数失败: ' + e.message;
        }
    });

    // From JSON to UrlEncoded Form
    jsonToFormBtn.addEventListener('click', () => {
        const text = fjInput.value.trim();
        if (!text) { fjOutput.value = ''; return; }

        try {
            const obj = JSON.parse(text);
            const params = new URLSearchParams();

            // 简单的对象拍平转化为 form
            if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
                for (let key in obj) {
                    const value = obj[key];
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else if (typeof value === 'object' && value !== null) {
                        // 复杂对象转成 JSON 字符串参数
                        params.append(key, JSON.stringify(value));
                    } else {
                        params.append(key, value === null ? '' : value);
                    }
                }
                const result = params.toString();
                // 把被 encode 的部分字符反编译回来展示，可能会更好看一些（视情况，如果不解码也行）
                fjOutput.value = decodeURIComponent(result);
            } else {
                fjOutput.value = '❌ 根节点必须是一个 Object 才能转换成 Form 参数';
            }
        } catch (e) {
            fjOutput.value = '❌ JSON 解析失败: ' + e.message;
        }
    });
});
