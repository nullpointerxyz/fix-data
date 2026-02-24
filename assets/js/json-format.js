document.addEventListener('DOMContentLoaded', () => {
    const jfInput = document.getElementById('jf-input');
    const jfOutput = document.getElementById('jf-output');
    const jfFormatBtn = document.getElementById('jf-format-btn');
    const jfMinifyBtn = document.getElementById('jf-minify-btn');

    jfFormatBtn.addEventListener('click', () => {
        const text = jfInput.value.trim();
        if (!text) { jfOutput.value = ''; return; }
        try {
            const obj = JSON.parse(text);
            jfOutput.value = JSON.stringify(obj, null, 2);
        } catch (e) {
            jfOutput.value = '❌ JSON 解析失败: ' + e.message;
        }
    });

    jfMinifyBtn.addEventListener('click', () => {
        const text = jfInput.value.trim();
        if (!text) { jfOutput.value = ''; return; }
        try {
            const obj = JSON.parse(text);
            jfOutput.value = JSON.stringify(obj);
        } catch (e) {
            jfOutput.value = '❌ JSON 解析失败: ' + e.message;
        }
    });
});
