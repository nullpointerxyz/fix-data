document.addEventListener('app-components-loaded', () => {
    const sfInput = document.getElementById('sf-input');
    const sfOutput = document.getElementById('sf-output');
    const sfFormatBtn = document.getElementById('sf-format-btn');
    const sfMinifyBtn = document.getElementById('sf-minify-btn');
    const sfLanguage = document.getElementById('sf-language');
    const sfKeywordCase = document.getElementById('sf-keyword-case');
    const sfTabWidth = document.getElementById('sf-tab-width');

    function getFormatOptions() {
        const tabVal = sfTabWidth.value;
        return {
            language: sfLanguage.value,
            keywordCase: sfKeywordCase.value,
            tabWidth: tabVal === 'tab' ? 2 : parseInt(tabVal),
            useTabs: tabVal === 'tab',
            linesBetweenQueries: 2,
        };
    }

    sfFormatBtn.addEventListener('click', () => {
        const text = sfInput.value.trim();
        if (!text) { sfOutput.value = ''; return; }
        try {
            sfOutput.value = sqlFormatter.format(text, getFormatOptions());
        } catch (e) {
            sfOutput.value = '❌ SQL 格式化失败: ' + e.message;
        }
    });

    sfMinifyBtn.addEventListener('click', () => {
        const text = sfInput.value.trim();
        if (!text) { sfOutput.value = ''; return; }
        // 压缩：多余空白合并为单个空格
        sfOutput.value = text.replace(/\s+/g, ' ').trim();
    });
});
