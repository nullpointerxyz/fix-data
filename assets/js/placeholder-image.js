document.addEventListener('DOMContentLoaded', () => {
    // 获取 DOM 元素
    const widthInput = document.getElementById('ph-width');
    const heightInput = document.getElementById('ph-height');
    const bgcolortInput = document.getElementById('ph-bgcolor');
    const textcolorInput = document.getElementById('ph-textcolor');
    const textInput = document.getElementById('ph-text');
    const formatRadios = document.querySelectorAll('input[name="ph-format"]');
    
    const generateBtn = document.getElementById('ph-generate-btn');
    const downloadBtn = document.getElementById('ph-download-btn');
    const previewImg = document.getElementById('ph-preview-img');
    const previewPlaceholder = document.getElementById('ph-preview-placeholder');

    // 当前生成的图片数据
    let currentImageBase64 = null;

    // 获取选中的图片格式
    function getSelectedFormat() {
        for (const radio of formatRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'png';
    }

    // 生成图片的函数
    function generatePlaceholder() {
        const width = parseInt(widthInput.value) || 800;
        const height = parseInt(heightInput.value) || 600;
        const bgColor = bgcolortInput.value;
        const textColor = textcolorInput.value;
        const format = getSelectedFormat();
        
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
        // 动态计算字体大小：取宽和高中较小者的 1/5，或者最多 100px
        const fontSize = Math.min(Math.min(width, height) * 0.2, 100);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 绘制多行文本（如果有换行符 \n）
        const lines = text.split('\\n');
        const lineHeight = fontSize * 1.2;
        const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, startY + index * lineHeight);
        });

        // 导出
        const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
        currentImageBase64 = canvas.toDataURL(mimeType, 0.9);

        // 更新预览
        previewImg.src = currentImageBase64;
        previewImg.style.display = 'block';
        previewPlaceholder.style.display = 'none';
        
        // 如果高度大于宽度很多，或者宽度很大，确保预览适配容器
        previewImg.style.maxWidth = '100%';
        previewImg.style.maxHeight = '400px';
        previewImg.style.objectFit = 'contain';
    }

    // 下载图片的函数
    function downloadImage() {
        if (!currentImageBase64) {
            // 如果还没生成，先生成一次
            generatePlaceholder();
        }

        const width = parseInt(widthInput.value) || 800;
        const height = parseInt(heightInput.value) || 600;
        const format = getSelectedFormat();
        
        const a = document.createElement('a');
        a.href = currentImageBase64;
        a.download = `placeholder_${width}x${height}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 绑定事件
    generateBtn.addEventListener('click', generatePlaceholder);
    downloadBtn.addEventListener('click', downloadImage);

    // 当用户修改任意参数时，可以通过监听 input 自动更新（可选，这里为了性能暂不做实时更新，但如果想要可以加上）
    // const inputs = [widthInput, heightInput, bgcolortInput, textcolorInput, textInput];
    // inputs.forEach(input => input.addEventListener('change', generatePlaceholder));
    // formatRadios.forEach(radio => radio.addEventListener('change', generatePlaceholder));
});
