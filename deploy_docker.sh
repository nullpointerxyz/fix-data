#!/bin/bash

# 定义变量
IMAGE_NAME="fix-data"
CONTAINER_NAME="my-fix-data"
PORT=12555

echo "开始构建镜像: ${IMAGE_NAME} ..."
docker build -t ${IMAGE_NAME}:latest .

# 检查是否存在同名容器，如果存在则停止并删除
if [ $(docker ps -a -q -f name=^/${CONTAINER_NAME}$) ]; then
    echo "发现已存在的容器 ${CONTAINER_NAME}，正在停止并删除..."
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

echo "运行新容器: ${CONTAINER_NAME} ..."
docker run -d -p ${PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}:latest

echo "部署完成！你可以通过访问 http://localhost:${PORT} 来查看网页。"
