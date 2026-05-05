# Test
学习项目

# Git 常见团队开发流程（feature/xxx 个人功能开发 → dev 开发集成 → main 生产）

```bash
git status          #查看冲突文件
git fetch origin    #更新分支状态
git branch -a       #查看本地和远程所有分支

git branch -vv      #检查本地分支是否绑定了远程分支（upstream）
```

## 1. 更新主干分支（main / dev）
```bash
git switch main
git pull origin main

git switch dev
git pull origin dev
```

## 2、创建功能分支（从 dev 切）
```bash
git switch -c feature/my-feature

git add .
git commit -m "feat: 完成xxx功能"

git push -u origin feature/my-feature #首次推送 + 绑定 upstream
git push #之后就可以直接push
```
commit 规范：
- feat: 新功能
- fix: 修复 bug
- refactor: 重构
- chore: 构建 / 工具
- docs: 文档

## 3. 功能开发完成 → 合并到 dev（PR/MR）
```bash
```
## 其他设定
```bash
#适合跨平台团队, commit 时：CRLF → LF, checkout 时：保持 LF
#.gitattributes 增加 * text=auto eol=lf
git config --global core.autocrlf input 
```

```bash
```