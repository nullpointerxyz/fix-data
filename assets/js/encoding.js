document.addEventListener('app-components-loaded', () => {
    const encInput = document.getElementById('enc-input');
    const encOutput = document.getElementById('enc-output');

    function bindBtn(id, fn) {
        document.getElementById(id).addEventListener('click', () => {
            const text = encInput.value;
            if (!text) { encOutput.value = ''; return; }
            try {
                encOutput.value = fn(text);
            } catch (e) {
                encOutput.value = '❌ 转换失败: ' + e.message;
            }
        });
    }

    // Base64
    bindBtn('enc-base64-encode', text => btoa(unescape(encodeURIComponent(text))));
    bindBtn('enc-base64-decode', text => decodeURIComponent(escape(atob(text))));

    // URL
    bindBtn('enc-url-encode', text => encodeURIComponent(text));
    bindBtn('enc-url-decode', text => decodeURIComponent(text));

    // Unicode
    bindBtn('enc-unicode-encode', text => {
        return text.split('').map(ch => {
            const code = ch.charCodeAt(0);
            return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : ch;
        }).join('');
    });
    bindBtn('enc-unicode-decode', text => {
        return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    });

    // HTML Entity
    bindBtn('enc-html-encode', text => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    });
    bindBtn('enc-html-decode', text => {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div.textContent;
    });
});
