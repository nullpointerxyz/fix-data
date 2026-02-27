document.addEventListener('app-components-loaded', () => {
    const input = document.getElementById('sl-input');
    if (!input) return;

    const ids = [
        'sl-chars', 'sl-chars-no-space', 'sl-bytes-utf8', 'sl-bytes-gbk',
        'sl-chinese', 'sl-english', 'sl-digits', 'sl-spaces',
        'sl-lines', 'sl-words', 'sl-symbols', 'sl-fullwidth'
    ];
    const els = {};
    ids.forEach(id => { els[id] = document.getElementById(id); });

    function calcUtf8Bytes(str) {
        return new Blob([str]).size;
    }

    // GBK 估算：ASCII 占 1 字节，其余（中文/全角等）占 2 字节
    function calcGbkBytes(str) {
        let bytes = 0;
        for (const ch of str) {
            bytes += ch.charCodeAt(0) <= 0x7F ? 1 : 2;
        }
        return bytes;
    }

    function analyze(text) {
        const chars = [...text];
        const len = chars.length;
        const noSpace = chars.filter(c => c !== ' ' && c !== '\t').length;
        const chinese = chars.filter(c => /[\u4e00-\u9fff\u3400-\u4dbf]/.test(c)).length;
        const english = chars.filter(c => /[a-zA-Z]/.test(c)).length;
        const digits = chars.filter(c => /[0-9]/.test(c)).length;
        const spaces = chars.filter(c => c === ' ').length;
        const lines = text === '' ? 0 : text.split('\n').length;
        // 中英文混合单词统计
        const words = text === '' ? 0 : text.match(/[\u4e00-\u9fff\u3400-\u4dbf]|[a-zA-Z0-9]+/g)?.length || 0;
        const symbols = chars.filter(c => /[^\w\s\u4e00-\u9fff\u3400-\u4dbf]/.test(c)).length;
        // 全角字符：FF01-FF5E
        const fullwidth = chars.filter(c => {
            const code = c.charCodeAt(0);
            return (code >= 0xFF01 && code <= 0xFF5E) || (code >= 0x3000 && code <= 0x303F);
        }).length;

        return { len, noSpace, chinese, english, digits, spaces, lines, words, symbols, fullwidth };
    }

    function update() {
        const text = input.value;
        const r = analyze(text);

        els['sl-chars'].textContent = r.len.toLocaleString();
        els['sl-chars-no-space'].textContent = r.noSpace.toLocaleString();
        els['sl-bytes-utf8'].textContent = calcUtf8Bytes(text).toLocaleString();
        els['sl-bytes-gbk'].textContent = calcGbkBytes(text).toLocaleString();
        els['sl-chinese'].textContent = r.chinese.toLocaleString();
        els['sl-english'].textContent = r.english.toLocaleString();
        els['sl-digits'].textContent = r.digits.toLocaleString();
        els['sl-spaces'].textContent = r.spaces.toLocaleString();
        els['sl-lines'].textContent = r.lines.toLocaleString();
        els['sl-words'].textContent = r.words.toLocaleString();
        els['sl-symbols'].textContent = r.symbols.toLocaleString();
        els['sl-fullwidth'].textContent = r.fullwidth.toLocaleString();

        // 数字变化时加个小动画
        Object.values(els).forEach(el => {
            el.classList.remove('strlen-pop');
            void el.offsetWidth;
            el.classList.add('strlen-pop');
        });
    }

    input.addEventListener('input', update);
});
