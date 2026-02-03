Galgame 沉浸式背词
github上有很多利用Galgame学日语的成熟项目了，我用下来最大的感觉是不想一边玩一边学，本项目将本地galgame素材导入，想刷抖音一样刷单词吧，每一个页面是由一句游戏文本和对应语音和随机CG组成的，不想打开游戏时随便刷刷吧。

**VocabFlow** 是一款旨在与 Galgame（视觉小说）资源直接集成的沉浸式日语词汇和句子学习应用。它允许你导入游戏脚本和音频文件，利用现代浏览器的 "FileSystem Access API" 直接读取本地资源，无需上传，为你提供上下文丰富的卡片学习体验。

## ✨ 功能特性

- **沉浸式 "心流" 体验**：类似 TikTok 的垂直滚动界面，用于复习词汇和句子，极其丝滑。
- **Galgame 深度集成**：
    - 支持导入解包的游戏脚本（通过工具支持 `.ast` 格式）。
    - 直接映射本地硬盘上的语音（`.ogg`/`.wav`）和背景资源。
    - **上下文语音**：自动为每个句子播放对应的角色语音。
    - **动态背景**：自动导入游戏 CG/背景图 (>1MB) 作为卡片背景，轮流展示。
- **Anki 同步**：
    - 一键导出到 Anki (需安装 AnkiConnect)。
    - **智能字段映射**：自动适配 Basic、Japanese 等多种卡片类型。
    - **选中导出**：选中句子中的部分文本，仅导出选中内容。
- **SRS (间隔重复系统)**：内置算法根据你的表现（困难/良好）科学安排复习时间。
- **音调可视化**：提供日语声调的视觉指示器（依赖数据源）。
- **零上传隐私保护**：使用浏览器的 FileSystem Access API。你那几十 GB 的语音文件保留在本地磁盘上，应用仅读取它们，无需漫长的上传过程。

## 🛠 技术栈

- **前端**: React, TypeScript, Vite
- **样式**: Tailwind CSS, Framer Motion (动画)
- **状态/数据库**: Dexie.js (IndexedDB 封装库) ，用于在浏览器中高效存储数万张卡片和脚本行。
- **音频**: Howler.js

## 🚀 快速开始

###以此为基础

- Node.js (v18+)
- Python 3.x (用于脚本提取工具)

### 安装

1.  克隆仓库：
    ```bash
    git clone https://github.com/yourusername/vocab-flow.git
    cd vocab-flow
    ```

2.  安装依赖：
    ```bash
    npm install
    ```

3.  启动开发服务器：
    ```bash
    npm run dev
    ```

## 📖 使用指南

### 1. 准备游戏资源
本应用目前支持从 Artemis 引擎（例如《Amakano 3》）解包的资源。

1.  **提取脚本**：使用 `GARbro` 等工具从游戏中提取 `.ast` 脚本文件和 `.ogg` 语音文件。
2.  **生成索引**：
    运行包含的 Python 工具来解析脚本并生成 `galgame_index.json`。
    ```bash
    python tools/reextract_script.py
    ```
    这将在 `public/` 目录下生成包含文本到音频映射关系的 `galgame_index.json` 文件。

### 2. 导入应用
1.  在浏览器（推荐 Chrome 或 Edge）中打开应用。
2.  点击右上角的 **设置 (齿轮图标)**。
3.  **Step 1: 选择游戏文件夹**：选择包含 `voice/` 和 `script/` 子目录的游戏根文件夹。（游戏资源由“GARbro”等工具自行解包提取）。浏览器询问时请授予读取权限。
4.  **Step 2: 加载脚本数据**：将 `galgame_index.json` 数据导入浏览器数据库。
5.  **Step 3: 生成卡组**：根据导入的句子自动生成学习闪卡。

### 3. 复习
- **左滑** 或点击 "Review"：如果你觉得这个词很难，需要稍后重现。
- **下滑**：标记为 "Good" 并继续下一张卡片。
- **点击文本**：可以选择并复制句子内容。

### 4. Anki 集成 (可选)
本应用支持通过 [AnkiConnect](https://github.com/FooSoft/anki-connect) 将生词一键导出到本地 Anki。

1. **安装 AnkiConnect**：在 Anki 桌面版中安装插件，代码 `2055492159`。
2. **配置**：通常无需更改配置。确保 Anki 正在运行。
3. **连接**：在应用设置中点击 "Check" 测试连接。成功后会显示牌组和卡片类型下拉框。
4. **设置**：从下拉框选择目标 Deck 和 Model。支持任意卡片类型（如 Basic、日语专用模板等）。
5. **导出**：
    - 在卡片的句子上下文区域点击 **ANKI** 按钮。
    - **选中导出**：先选中句子中的部分文本，再点击导出，仅保存选中内容。
    - 语音文件会自动附带到 Anki 卡片中。

## 📂 项目结构

- `/src`
    - `/components`: UI 组件 (FlowCard, FlowDeck 等)
    - `/db`: 数据库 Schema 定义 (Dexie)
    - `/utils`: SRS 算法逻辑, 文件系统处理程序。
- `/tools`: 用于处理游戏资产的 Python 脚本。
    - `reextract_script.py`: 主要的 `.ast` 文件解析器。

## ⚠️ 免责声明
本软件仅供**教育和学习目的**使用。你必须拥有你提取资源的游戏的合法副本。请勿分发提取的游戏资产。

## License
MIT
