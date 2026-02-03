---
name: setup_git
description: 初始化 Git 仓库并配置 .gitignore。
---

# Git 设置 Skill

此 Skill 用于初始化 Git 版本控制。

## 步骤

1.  **初始化 Git**
    - 使用 `run_command` 运行 `git init`。

2.  **创建 .gitignore**
    -根据项目类型创建或更新 `.gitignore` 文件。
    - **通用忽略项**:
      ```gitignore
      .DS_Store
      node_modules/
      dist/
      build/
      .env
      .vscode/
      .idea/
      *.log
      ```
    - **Python 特定**:
      ```gitignore
      __pycache__/
      *.py[cod]
      venv/
      .venv/
      .pytest_cache/
      ```
    - **Node/Web 特定**:
      ```gitignore
      npm-debug.log*
      pnpm-debug.log*
      yarn-error.log
      .npm/
      ```

3.  **首次提交 (可选)**
    - 询问用户是否进行首次提交。
    - 如果是，运行 `git add .` 和 `git commit -m "Initial commit"`。
