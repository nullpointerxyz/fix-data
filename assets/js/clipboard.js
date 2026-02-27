document.addEventListener('app-components-loaded', () => {
    const textareas = [
        document.getElementById('cb-1'),
        document.getElementById('cb-2'),
        document.getElementById('cb-3'),
        document.getElementById('cb-4'),
        document.getElementById('cb-5')
    ];

    textareas.forEach((ta, index) => {
        if (!ta) return;

        // 加载保存的值
        const storedVal = localStorage.getItem(`data_transformer_cb_${index}`);
        if (storedVal) {
            ta.value = storedVal;
        }

        // 监听输入，实时保存到 localStorage
        ta.addEventListener('input', () => {
            localStorage.setItem(`data_transformer_cb_${index}`, ta.value);
        });
    });
});
