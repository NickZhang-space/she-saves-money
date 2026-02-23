#!/bin/bash
echo "推送代码到Github仓库..."

# 配置git用户信息
git config --local user.name "小D"
git config --local user.email "assistant@openclaw.ai"

# 添加所有文件
git add .

# 提交
git commit -m "更新：配置云开发环境ID

- 更新app.js中的环境ID为cloud1-9gvj1jvz9f8d3f6f
- 创建project.config.json配置文件
- 更新开发文档"

# 推送（需要主人配置Github token）
echo "请主人配置Github token后运行："
echo "git push -u origin main"