---
name: implement_feature
description: 严谨的功能开发工作流：计划 -> 实施 -> 验证。
---

# 功能实现 Skill

此 Skill 定义了一个标准化的功能开发流程，确保代码质量和可维护性。

## 步骤

1.  **需求分析与计划 (PLANNING)**
    - 创建或更新 `implementation_plan.md`。
    - 明确功能目标 (Goal Description)。
    - 列出受影响的文件和拟定变更 (Proposed Changes)。
    - 制定验证计划 (Verification Plan)。
    - **关键**: 在开始编码前，使用 `notify_user` 请求用户审查计划。

2.  **创建功能分支 (可选)**
    - 如果使用 Git，建议创建新分支：`git checkout -b feature/name-of-feature`。

3.  **代码实施 (EXECUTION)**
    - 根据计划逐步修改代码。
    - 遵循现有的代码风格和最佳实践。
    - 保持 `task.md` 的更新，追踪子任务进度。

4.  **验证与测试 (VERIFICATION)**
    - 运行自动化测试 (如果有)。
    - 进行手动验证（例如启动应用并检查 UI）。
    - 记录验证结果。
    - 如果发现 Bug，在当前任务中修复，并更新状态。

5.  **完成与交付**
    - 创建或更新 `walkthrough.md`，展示完成的工作（截图、通过的测试日志）。
    - 清理临时文件。
    - 通知用户任务完成。
