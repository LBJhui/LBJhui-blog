# /bin/bash

# 确保脚本抛出遇到的错误
set -e

# 打包生成静态文件
pnpm run build

# 进入待发布的 dist/ 目录
cd docs/.vitepress/dist

current_time=$(date +"%Y-%m-%d")

# 提交打包静态网站到 github-pages 分支
git init
git add .
git commit -m $current_time

# 部署到 https://<username>.github.io/<repo>
git push -f https://github.com/LBJhui/LBJhui-blog.git master

# 提交所有代码到github
cd ../../../
git add .
git commit -m $current_time
git push
