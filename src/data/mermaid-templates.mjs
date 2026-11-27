// Localized labels share the same diagram structure so edits stay in sync.
export const mermaidTemplates = [
    {
        slug: 'login-sequence',
        'zh-CN': ['登录时序图', '用时序图解释登录为什么会得到两种结果：凭据正确时签发会话，错误时直接返回，不创建会话。', '试着在成功分支中加入一次会话过期检查，再从浏览器发起第二个请求。'],
        en: ['Login sequence diagram', 'Show both outcomes of a sign-in request: valid credentials create a session, while a rejected request returns without creating one.', 'Try adding a second browser request that checks whether the session has expired.'],
        diagram: (en = false) => `sequenceDiagram
    participant B as ${en ? 'Browser' : '浏览器'}
    participant A as ${en ? 'Auth service' : '认证服务'}
    participant S as ${en ? 'Session store' : '会话存储'}
    B->>A: POST /login
    alt ${en ? 'Credentials valid' : '凭据正确'}
        A->>S: ${en ? 'Create session' : '创建会话'}
        S-->>A: ${en ? 'Session ID' : '会话标识'}
        A-->>B: 200 OK + Set-Cookie
    else ${en ? 'Credentials invalid' : '凭据错误'}
        A-->>B: 401 Unauthorized
    end`
    },
    {
        slug: 'ci-cd-release',
        'zh-CN': ['CI/CD 发布流程', '从提交代码到生产部署：测试失败会停止发布；上线后健康检查失败，则回滚到上一版本。', '如果生产部署需要人工审批，在构建和部署之间插入审批节点，而不是放在回滚之后。'],
        en: ['CI/CD release pipeline', 'Trace a commit through release. Failed tests stop the pipeline before deployment; a failed production health check rolls back the release.', 'To model manual approval, insert a review step between the build and deployment nodes.'],
        diagram: (en = false) => `flowchart TD
    A[${en ? 'Push commit' : '提交代码'}] --> B{${en ? 'Tests pass?' : '测试通过？'}}
    B -->|${en ? 'No' : '否'}| C[${en ? 'Stop release' : '停止发布'}]
    B -->|${en ? 'Yes' : '是'}| D[${en ? 'Build artifact' : '构建产物'}]
    D --> E[${en ? 'Deploy to production' : '部署到生产环境'}]
    E --> F{${en ? 'Healthy?' : '健康检查通过？'}}
    F -->|${en ? 'No' : '否'}| G[${en ? 'Roll back' : '回滚上一版本'}]
    F -->|${en ? 'Yes' : '是'}| H[${en ? 'Mark release complete' : '标记发布完成'}]`
    },
    {
        slug: 'agent-tool-call',
        'zh-CN': ['AI Agent 工具调用', '以查询天气为例，区分模型提出调用、应用校验参数和工具返回数据这三个步骤。参数无效时不执行工具。', '把天气查询换成库存查询，并在工具超时时添加一个返回错误的分支。'],
        en: ['AI agent tool call', 'Follow a weather lookup: the model proposes a tool call, the app validates its arguments, and the tool returns data. Invalid arguments never reach the tool.', 'Swap the weather lookup for an inventory check, then add a branch for a tool timeout.'],
        diagram: (en = false) => `sequenceDiagram
    participant A as ${en ? 'Application' : '应用'}
    participant M as ${en ? 'Model' : '模型'}
    participant T as ${en ? 'Weather tool' : '天气工具'}
    A->>M: ${en ? 'Ask for the weather' : '询问天气'}
    M-->>A: get_weather(city)
    alt ${en ? 'Valid city' : '城市参数有效'}
        A->>T: get_weather(city)
        T-->>A: ${en ? 'Temperature' : '返回温度'}
        A->>M: ${en ? 'Provide tool result' : '提供工具结果'}
        M-->>A: ${en ? 'Summarize forecast' : '总结天气'}
    else ${en ? 'Missing city' : '缺少城市'}
        A-->>A: ${en ? 'Ask user for a city' : '请用户补充城市'}
    end`
    }
];
export const templatePaths = mermaidTemplates.map(t => 'templates/mermaid/' + t.slug + '/');
