document.addEventListener('DOMContentLoaded', () => {
    // 初始化选项卡设置
    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolPanels = document.querySelectorAll('.tool-panel');
    const STORAGE_KEY = 'data_transformer_tabs';

    // 所有可用的工具
    const allTools = Array.from(tabBtns).map(btn => ({
        id: btn.dataset.tool,
        name: btn.textContent.trim()
    }));

    // 加载配置或使用默认配置（全选）
    let activeTabs = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!activeTabs || !Array.isArray(activeTabs)) {
        activeTabs = allTools.map(t => t.id);
    }

    // 根据配置显示/隐藏选项卡
    function renderTabs() {
        tabBtns.forEach(btn => {
            if (activeTabs.includes(btn.dataset.tool)) {
                btn.style.display = '';
            } else {
                btn.style.display = 'none';
            }
        });

        // 确保如果有隐藏当前 active 的情况，重新选中第一个可见的
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn && activeBtn.style.display === 'none') {
            const firstVisible = Array.from(tabBtns).find(b => b.style.display !== 'none');
            if (firstVisible) {
                firstVisible.click();
            }
        }
    }

    renderTabs();

    // Tab 切换逻辑
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            toolPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tool-' + btn.dataset.tool).classList.add('active');
        });
    });

    // ========== 全局设置弹窗逻辑 ==========
    const settingsBtn = document.getElementById('global-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const settingsList = document.getElementById('settings-tabs-list');

    function openSettings() {
        settingsList.innerHTML = '';

        // 全选 / 全不选 按钮
        const selectAllLabel = document.createElement('label');
        selectAllLabel.className = 'checkbox-wrapper';
        selectAllLabel.style.marginBottom = '1rem';
        selectAllLabel.style.borderBottom = '1px solid var(--panel-border)';
        selectAllLabel.style.paddingBottom = '0.8rem';

        const isAllChecked = activeTabs.length === allTools.length ? 'checked' : '';

        selectAllLabel.innerHTML = `
            <input type="checkbox" id="settings-select-all" ${isAllChecked}>
            <span class="checkmark"></span>
            <strong>全选 / 全不选</strong>
        `;
        settingsList.appendChild(selectAllLabel);
        const selectAllCb = selectAllLabel.querySelector('input');

        // 生成各工具选项
        const toolCheckboxes = [];
        allTools.forEach(tool => {
            const label = document.createElement('label');
            label.className = 'checkbox-wrapper';

            const isChecked = activeTabs.includes(tool.id) ? 'checked' : '';

            label.innerHTML = `
                <input type="checkbox" value="${tool.id}" class="tool-setting-cb" ${isChecked}>
                <span class="checkmark"></span>
                <span>${tool.name}</span>
            `;
            settingsList.appendChild(label);
            toolCheckboxes.push(label.querySelector('input'));
        });

        // 全选按钮联动逻辑
        selectAllCb.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            toolCheckboxes.forEach(cb => {
                cb.checked = isChecked;
            });
        });

        // 子项变更时反向联动全选按钮
        toolCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const allChecked = toolCheckboxes.every(c => c.checked);
                selectAllCb.checked = allChecked;
            });
        });

        settingsModal.classList.add('active');
    }

    function closeSettings() {
        settingsModal.classList.remove('active');
    }

    function saveSettings() {
        const checkboxes = settingsList.querySelectorAll('.tool-setting-cb');
        const newActiveTabs = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (newActiveTabs.length === 0) {
            alert('至少需要保留一个功能选项卡！');
            return;
        }

        activeTabs = newActiveTabs;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTabs));
        renderTabs();
        closeSettings();
    }

    settingsBtn.addEventListener('click', openSettings);
    closeSettingsBtn.addEventListener('click', closeSettings);
    saveSettingsBtn.addEventListener('click', saveSettings);

    // 点击弹窗外部关闭
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettings();
        }
    });

    // 通用复制按钮
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target || !target.value) return;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(target.value);
            } else {
                target.select();
                document.execCommand('copy');
            }

            btn.style.color = 'var(--success-color)';
            setTimeout(() => { btn.style.color = ''; }, 1500);
        });

        // 在复制按钮旁插入"新窗口打开"按钮，并将两个按钮包到一组
        const openBtn = document.createElement('button');
        openBtn.className = 'icon-btn tooltip';
        openBtn.type = 'button';
        openBtn.dataset.tooltip = '新窗口打开';
        openBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'output-btn-group';
        btn.parentNode.insertBefore(btnGroup, btn);
        btnGroup.appendChild(btn);
        btnGroup.appendChild(openBtn);

        openBtn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target || !target.value) return;

            const win = window.open('', '_blank');
            win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>输出结果</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#e0e0e0;font-family:'JetBrains Mono',monospace}
textarea{width:100%;height:100vh;background:#1a1a2e;color:#e0e0e0;border:none;outline:none;
padding:1.5rem;font-family:inherit;font-size:14px;resize:none;line-height:1.6}
</style></head><body>
<textarea readonly>${target.value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
</body></html>`);
            win.document.close();
        });
    });

    // 自动给所有非只读输入框添加清空按钮
    document.querySelectorAll('textarea:not([readonly]), input.text-input').forEach(el => {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-clearable';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);

        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.type = 'button';
        clearBtn.title = '清空';
        clearBtn.textContent = '✕';
        wrapper.appendChild(clearBtn);

        clearBtn.addEventListener('click', () => {
            el.value = '';
            el.dispatchEvent(new Event('input'));
            el.focus();
        });
    });
});
