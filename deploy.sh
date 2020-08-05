#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下 
cd dist

# git 操作
git init
git config user.name "FannyZhou"
git config user.email "2644339003@qq.com"
git add -A
git commit -m 'deploy by script'
git push --force --quiet "https://7f955cfa9966ba700dca4e9703aa15f5e1e64137@github.com/MiaomiaoFanny/plane-war.git" master:gh-pages
# git push -f git@github.com:MiaomiaoFanny/plane-war.git master:gh-pages

# 回到原来的目录
cd -