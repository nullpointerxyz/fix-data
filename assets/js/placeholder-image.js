document.addEventListener('DOMContentLoaded', () => {
    // 获取 DOM 元素
    const widthInput = document.getElementById('ph-width');
    const heightInput = document.getElementById('ph-height');
    const bgcolortInput = document.getElementById('ph-bgcolor');
    const textcolorInput = document.getElementById('ph-textcolor');
    const textInput = document.getElementById('ph-text');
    const formatRadios = document.querySelectorAll('input[name="ph-format"]');
    const targetSizeInput = document.getElementById('ph-target-size');

    const generateBtn = document.getElementById('ph-generate-btn');
    const downloadBtn = document.getElementById('ph-download-btn');
    const previewImg = document.getElementById('ph-preview-img');
    const previewPlaceholder = document.getElementById('ph-preview-placeholder');

    // 当前生成的对象及 URL
    let currentImageBlob = null;
    let currentImageUrl = null;

    // 显示大小的组件
    const statsEl = document.createElement('div');
    statsEl.style.marginTop = '10px';
    statsEl.style.fontSize = '0.9rem';
    statsEl.style.color = 'var(--text-secondary)';
    statsEl.style.textAlign = 'center';
    previewImg.parentNode.parentNode.appendChild(statsEl);

    // 获取选中的图片格式
    function getSelectedFormat() {
        for (const radio of formatRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'png';
    }

    // 格式化字节大小显示
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 生成图片的函数 (为了处理 Blob 采用异步回调/Promise模式)
    function generatePlaceholder(callback) {
        const width = parseInt(widthInput.value) || 800;
        const height = parseInt(heightInput.value) || 600;
        const bgColor = bgcolortInput.value;
        const textColor = textcolorInput.value;
        const format = getSelectedFormat();
        const targetSizeKB = parseInt(targetSizeInput.value);

        let text = textInput.value;
        if (!text) {
            text = `${width} x ${height}`;
        }

        // 创建临时 canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 绘制背景
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // 绘制文字
        ctx.fillStyle = textColor;
        const fontSize = Math.min(Math.min(width, height) * 0.2, 100);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = text.split('\\n');
        const lineHeight = fontSize * 1.2;
        const startY = height / 2 - (lines.length - 1) * lineHeight / 2;

        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, startY + index * lineHeight);
        });

        // 导出格式，部分版本浏览器支持 jpeg、webp 调整质量，这里统一用 0.9
        const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;

        canvas.toBlob(blob => {
            let finalBlob = blob;

            // 如果要求指定大小，且当前生成的大小未达到
            if (targetSizeKB && targetSizeKB > 0) {
                const targetBytes = targetSizeKB * 1024;
                if (targetBytes > blob.size) {
                    const paddingSize = targetBytes - blob.size;
                    // 生成全零字节进行填充
                    const paddingArrayBuffer = new ArrayBuffer(paddingSize);
                    const paddingBlob = new Blob([paddingArrayBuffer]);

                    // 将真实图片数据与填充数据拼接到一起
                    // （浏览器和常见看图软件遇到 PNG/JPG 的结束标识后会忽略尾部附加的乱码/空数据）
                    finalBlob = new Blob([blob, paddingBlob], { type: mimeType });
                }
            }

            // 清理旧ObjectURL避免内存溢出
            if (currentImageUrl) {
                URL.revokeObjectURL(currentImageUrl);
            }

            currentImageBlob = finalBlob;
            currentImageUrl = URL.createObjectURL(finalBlob);

            // 更新预览（因为多了空白内容，不影响 src 直接作为图像显示）
            previewImg.src = currentImageUrl;
            previewImg.style.display = 'block';
            previewPlaceholder.style.display = 'none';

            previewImg.style.maxWidth = '100%';
            previewImg.style.maxHeight = '400px';
            previewImg.style.objectFit = 'contain';

            // 更新显示文本
            statsEl.innerText = `生成文件大小估计: ${formatBytes(finalBlob.size)}`;

            if (callback && typeof callback === 'function') {
                callback();
            }
        }, mimeType, 0.9);
    }

    // 触发真正下载
    function triggerDownload() {
        const width = parseInt(widthInput.value) || 800;
        const height = parseInt(heightInput.value) || 600;
        const format = getSelectedFormat();

        const a = document.createElement('a');
        a.href = currentImageUrl;
        a.download = `placeholder_${width}x${height}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 绑定事件
    generateBtn.addEventListener('click', () => generatePlaceholder());
    downloadBtn.addEventListener('click', () => {
        // 保证用户修改参数后，点击直接下载也会获取最新
        generatePlaceholder(() => {
            triggerDownload();
        });
    });
});
