FROM node:16
# 复制代码
ADD . /app
# 工作目录
WORKDIR /app
# 换源头
# RUN sed -i "s/archive.ubuntu./mirrors.aliyun./g" /etc/apt/sources.list
# RUN sed -i "s/deb.debian.org/mirrors.aliyun.com/g" /etc/apt/sources.list
# RUN sed -i "s/security.debian.org/mirrors.aliyun.com\/debian-security/g" /etc/apt/sources.list

# 下载并构建
RUN yarn \
  && yarn build \
  && cd ./server \
  && yarn 
# 运行服务器
CMD [ "yarn", "start:server"] 