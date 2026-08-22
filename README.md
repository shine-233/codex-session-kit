# codex-session-kit

> 判⑦融合：dsh 帧式持久化之上的读取/迁移/记忆层。

## 吸收来源
- rollout (13,749 读侧) / rollout-trace (12,381) / message-history
- state + thread-store (SQLite 查询镜像与 fork lineage，判⑦采纳)
- external-agent-migration (14,999 读半边)
- agent-graph-store / file-search
- memories/read + memories/write (4,494, dsh 缺失的新功能)
- ext/history-notes

## 功能边界
**做**：读 codex/Claude Code/Gemini 会话并导入 dsh；trace 回放调试面板数据源；跨会话记忆存取。

**不做**：不替代 dsh 自己的 session-persistence-jsonl 写路径。

## API 草图
```
importSession(src): DshSession
MemoryStore.get/set/query(...)
```

## 验收标准
现有 codex 会话完整导入 dsh Web UI；跨会话记忆生效；trace 可回放。

## 上游同步
基于 openai/codex@970b7f2ff4f6（Apache-2.0）。季度 diff 由 dsh-codex-ledger CI 触发，见 ledger/coverage.yaml 对应行。

## M3 状态（已落地）
- ✅ rollout 容错读取器（坏行计数、header 捕获、toDshEvents 归一）
- ✅ MemoryStore 追加式记忆存储（重开重建、可删除）
（已完成）、trace 回放、外部 agent 导入映射表

## 追加交付
- ✅ **Claude Code 会话导入器**：listProjects/listSessions/parseClaudeSession/claudeToDshEvents——本机 ~/.claude/projects 即数据源
