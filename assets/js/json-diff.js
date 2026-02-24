document.addEventListener('DOMContentLoaded', () => {
    const jdLeft = document.getElementById('jd-left');
    const jdRight = document.getElementById('jd-right');
    const jdCompareBtn = document.getElementById('jd-compare-btn');
    const jdResult = document.getElementById('jd-result');

    jdCompareBtn.addEventListener('click', () => {
        const leftText = jdLeft.value.trim();
        const rightText = jdRight.value.trim();

        if (!leftText || !rightText) {
            jdResult.innerHTML = '<div class="diff-placeholder">请输入两个 JSON 进行比对</div>';
            return;
        }

        let leftObj, rightObj;
        try {
            leftObj = JSON.parse(leftText);
        } catch (e) {
            jdResult.innerHTML = '<div class="diff-removed diff-line">❌ 左侧 JSON 解析失败: ' + escapeHtml(e.message) + '</div>';
            return;
        }
        try {
            rightObj = JSON.parse(rightText);
        } catch (e) {
            jdResult.innerHTML = '<div class="diff-removed diff-line">❌ 右侧 JSON 解析失败: ' + escapeHtml(e.message) + '</div>';
            return;
        }

        const diffs = deepDiff(leftObj, rightObj, '');

        if (diffs.length === 0) {
            jdResult.innerHTML = '<div class="diff-identical">✅ 两个 JSON 完全一致</div>';
            return;
        }

        let html = '';
        const added = diffs.filter(d => d.type === 'added');
        const removed = diffs.filter(d => d.type === 'removed');
        const modified = diffs.filter(d => d.type === 'modified');

        if (removed.length > 0) {
            html += '<div class="diff-section-title removed">— 仅在 A 中存在 (' + removed.length + ')</div>';
            removed.forEach(d => {
                html += '<div class="diff-line diff-removed">' + escapeHtml(d.path) + ': ' + escapeHtml(formatVal(d.leftVal)) + '</div>';
            });
        }

        if (added.length > 0) {
            html += '<div class="diff-section-title added">+ 仅在 B 中存在 (' + added.length + ')</div>';
            added.forEach(d => {
                html += '<div class="diff-line diff-added">' + escapeHtml(d.path) + ': ' + escapeHtml(formatVal(d.rightVal)) + '</div>';
            });
        }

        if (modified.length > 0) {
            html += '<div class="diff-section-title modified">~ 值不同 (' + modified.length + ')</div>';
            modified.forEach(d => {
                html += '<div class="diff-line diff-modified">' + escapeHtml(d.path) + '</div>';
                html += '<div class="diff-line diff-removed">  A: ' + escapeHtml(formatVal(d.leftVal)) + '</div>';
                html += '<div class="diff-line diff-added">  B: ' + escapeHtml(formatVal(d.rightVal)) + '</div>';
            });
        }

        jdResult.innerHTML = html;
    });

    /**
     * 递归比对两个对象，返回差异列表
     */
    function deepDiff(left, right, path) {
        const diffs = [];

        if (left === right) return diffs;

        if (typeof left !== typeof right || Array.isArray(left) !== Array.isArray(right)) {
            diffs.push({ type: 'modified', path: path || '(root)', leftVal: left, rightVal: right });
            return diffs;
        }

        if (Array.isArray(left)) {
            const maxLen = Math.max(left.length, right.length);
            for (let i = 0; i < maxLen; i++) {
                const p = path + '[' + i + ']';
                if (i >= left.length) {
                    diffs.push({ type: 'added', path: p, rightVal: right[i] });
                } else if (i >= right.length) {
                    diffs.push({ type: 'removed', path: p, leftVal: left[i] });
                } else {
                    diffs.push(...deepDiff(left[i], right[i], p));
                }
            }
            return diffs;
        }

        if (typeof left === 'object' && left !== null) {
            const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);
            for (const key of allKeys) {
                const p = path ? path + '.' + key : key;
                if (!(key in left)) {
                    diffs.push({ type: 'added', path: p, rightVal: right[key] });
                } else if (!(key in right)) {
                    diffs.push({ type: 'removed', path: p, leftVal: left[key] });
                } else {
                    diffs.push(...deepDiff(left[key], right[key], p));
                }
            }
            return diffs;
        }

        if (left !== right) {
            diffs.push({ type: 'modified', path: path || '(root)', leftVal: left, rightVal: right });
        }

        return diffs;
    }

    function formatVal(val) {
        if (val === undefined) return 'undefined';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
