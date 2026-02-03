---
name: init_project
description: 当目录为空或用户请求初始化新项目时，搭建新项目的脚手架。
---

# 项目初始化 Skill

此 Skill 用于在当前工作区初始化一个新的软件项目。

## 步骤

1.  **检查目录状态**
    - 检查当前目录是否为空或仅包含配置文件。
    - 如果目录不为空，询问用户是否确定要在此处初始化。

2.  **确定项目类型**
    - 询问用户想要创建什么类型的项目（例如：Web 前端、Python 脚本、Node.js 服务等）。

3.  **执行初始化命令**
    - **Web 前端 (React/Vue/Vanilla)**:
        - 使用 `run_command` 运行 `npm create vite@latest .` (如果用户同意在当前目录) 或 `npm create vite@latest <project-name>`。
        - *注意*: 最好使用非交互式标志，例如 `npm create vite@latest . -- --template react`，先询问用户偏好。
    - **Node.js**:
        - 运行 `npm init -y`。
        - 设置 `package.json` 中的基本字段。
    - **Python**:
        - 创建虚拟环境: `python -m venv venv` or `python -m venv .venv`
        - 创建 `requirements.txt`。
        - 创建 `main.py` 或 `app.py`。

4.  **安装依赖**
    - 对于 Node.js 项目，运行 `npm install`。
    - 对于 Python 项目，提示用户激活虚拟环境并安装必要的包。

5.  **生成初始文件**
    - 创建 README.md，包含项目名称和启动说明。
