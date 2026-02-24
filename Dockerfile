# 使用轻量级的 Nginx alpine 镜像作为基础镜像
FROM nginx:alpine

# 将本地所有文件（除 .dockerignore 排除的文件外）复制到 Nginx 的默认静态资源目录
COPY . /usr/share/nginx/html

# 暴露 80 端口供外部访问
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
