# Test
学习项目

```
your-repo/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI 自动检查
├── src/
│   ├── hello.js            # 核心模块
│   ├── hello.test.js       # Jest 单元测试
│   └── index.js            # 入口点
├── build.js                # 编译脚本（src → dist，排除测试文件）
├── eslint.config.js        # ESLint 规则
├── .gitattributes          # 跨平台换行符设定
├── .gitignore
└── package.json
```
<br>

# 测试执行
```bash
npm install     # 安装依赖

npm run lint    # ESLint 检查
npm test        # Jest 跑测试
npm run build   # 输出到 dist/

npm start       # 终端输出
```
<br>


# Git 常见团队开发流程
feature/xxx 个人功能开发 → dev 开发集成 → main 生产

```bash
git status          #查看冲突文件
git fetch origin    #更新分支状态
git branch -a       #查看本地和远程所有分支

git branch -vv      #检查本地分支是否绑定了远程分支（upstream）
```

步骤 1 - 6 循环
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

git push -u origin feature/my-feature   #首次推送 + 绑定 upstream
git push                                #之后直接push
```
commit 规范：
- feat: 新功能
- fix: 修复 bug
- refactor: 重构
- chore: 构建 / 工具
- docs: 文档

## 3. P/R前检查，功能分支可能落后 dev（开发过程中同步最新进度）
```bash
# 方法：rebase（保持线性 commit 历史，推荐）
git switch feature/my-feature
git fetch origin
git log --oneline feature/my-feature..origin/dev   # 检查是否落后
# 有输出的话 →
git rebase origin/dev # 抓取最新dev 到 my-feature

# 若有冲突，解决后：
git add .
git rebase --continue

# rebase 后需要 force push（因为 commit 历史改变了）
git push --force-with-lease
```

## 4. 功能开发完成, 网页提 PR → 合并到 dev
## 5. 团队 review → confirm 合并

## 6. 本地再次获取合并后的最新 dev
```bash
git switch dev
git pull origin dev
git branch -d feature/init    #本地删除分支
git push origin --delete feature/init #删除远程分支（项目可设定PR合并后自动执行删除）
```

## dev 累积更新后P/R推送到 main
**特别注意**：
PR dev to main 合并时 GitHub 会产生一个 merge commit，这个 commit 只存在于 main，dev 没有。
把 main 的 merge commit 拉回 dev 同步一下 (可以设定自动化 actions)
```bash
git switch dev
git pull origin main   # 或 git merge origin/main
git push origin dev
```

## 在错误的分支修改了功能，切去新分支
```bash
# 1. 在当前位置（带着 commit）建立新分支
git switch -c feature/my-feature

# 2. 把本地 dev 退回到远端 dev 的状态
git switch dev
git reset --hard origin/dev

# 3. 回到新分支，push 上去
git switch feature/my-feature
git push -u origin feature/my-feature
```

## 当前分支改到一半，需要临时切去处理其他需求
```bash
# 储藏所有改动（-u 含 untracked 文件）
git stash push -u -m "feat: xxx 做到一半"

# 此时工作区干净，可以安全切换分支
git switch feature/other
# ...处理其他需求，正常 commit push...

# 回来继续之前的工作
git switch feature/my-feature
git stash pop              # 取出最近一条 stash，恢复工作区

# 常用 stash 命令
git stash list             # 查看所有 stash 记录
git stash pop              # 取出最近一条（取出后从栈里删除）
git stash apply stash@{1}  # 取出指定条，但不删除（可多次应用）
git stash drop stash@{0}   # 手动删除指定条
```
<br>


## 其他设定
```bash
#适合跨平台团队, commit 时：CRLF → LF, checkout 时：保持 LF
#.gitattributes 增加 * text=auto eol=lf
git config --global core.autocrlf input   
```  
<br>

# CI

## Settings - Rulesets 建立 main、dev 保护规则
重点：
- Restrict deletions
- Require a pull request before merging
- Block force pushes
- Require status checks to pass 关联workflow - jobs (Lint / Test / Build) 
更新到remote后才能在 Settings - Rulesets 出现选项

## workflow 
ci.yml 触发时机：对 dev 或 main 发起 PR 时自动执行
- Check Source Branch ,限定只能从dev 更新到 main
- Lint ,ESLint 程式码风格检查
- Jtest ,Jest 单元测试
- Build ,编译检查，需 Lint + Test 先通过
