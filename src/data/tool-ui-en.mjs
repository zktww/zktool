// Tool-scoped visible copy. Short fragments must not affect other tools or code.
export const attributeUiEn = {
  '明文或密文': 'Plaintext or ciphertext', '加密：输入任意明文&#10;解密：粘贴 zkaes1: 开头的密文...': 'Encrypt: enter plaintext&#10;Decrypt: paste ciphertext starting with zkaes1:...', '输入加密/解密密码': 'Enter the encryption/decryption password',
  '八进制权限': 'Octal permissions', '如 192.168.1.100': 'For example: 192.168.1.100', '应用当前示例': 'Apply this example', '单位 A 相对长度': 'Relative length in unit A', '单位 B 相对长度': 'Relative length in unit B',
  '粘贴 curl 命令': 'Paste a curl command', '搜索：红心、笑哭了、thumb、rocket、🇨🇳…': 'Search: heart, laugh, thumb, rocket, 🇨🇳…', '搜索 Emoji': 'Search emoji', '清空搜索': 'Clear search', '清空最近使用': 'Clear recent emoji',
  '输入文本或 HTML 实体': 'Enter text or HTML entities', '输入文本或含实体的 HTML，例如：<div class=&quot;a&quot;> © 版权…': 'Enter text or HTML with entities, for example: &lt;div class=&quot;a&quot;&gt; © Copyright…', '速查类别': 'Reference category',
  '粘贴或输入 JSON，例如 {"a":1,"b":[true,null]}': 'Paste or enter JSON, for example {"a":1,"b":[true,null]}', '格式化结果文本': 'Formatted result as text', '格式化结果树形视图': 'Formatted result as a tree',
  'JWT Token 输入': 'JWT token input', '粘贴 JWT（xxx.yyy.zzz）...': 'Paste a JWT (xxx.yyy.zzz)...', '留空则跳过签名校验；出于安全考虑，密钥不参与草稿保存与分享链接': 'Leave empty to skip signature verification. Keys are excluded from drafts and shared links.',
  '公钥输出': 'Public key output', '私钥输出': 'Private key output', 'Markdown 文本': 'Markdown text', '排版主题': 'Publishing theme', '正文字号': 'Body text size', '图表预览': 'Diagram preview', '选择或拖入二维码图片': 'Choose or drop a QR code image',
  '如 0b101010 或 101010': 'For example: 0b101010 or 101010', '如 0o52 或 52': 'For example: 0o52 or 52', '如 42 或 -42': 'For example: 42 or -42', '如 0x2a 或 2a': 'For example: 0x2a or 2a', '在此按自定义进制输入或查看结果...': 'Enter a value or view the result in the custom base...',
  '正则 flag': 'Regular expression flag', 'SVG 预览': 'SVG preview', '输入文本（每行一条）': 'Input text (one item per line)', '基准日期时间': 'Base date and time', '输入 YAML 或 JSON': 'Enter YAML or JSON'
};

export const toolUiEn = {
  'hash-tool': {
    '试算 abc': 'Try abc',
    '用已知输入核对结果': 'Check a known digest',
    '输入小写 abc（UTF-8，不加换行），MD5 应为：': 'Enter lowercase abc in UTF-8 with no trailing newline. Its MD5 digest should be:',
    '在末尾按一次回车再比较：看起来只多了一行，实际参与计算的字节已经变了。': 'Now press Enter after the c and compare. The newline adds a byte, so the digest changes.'
  },
  'cert-decoder': {
    '怎样读这张示例证书？': 'How to read the sample certificate',
    '点击「示例」载入公开的演示 PEM。SAN 列出了 demo.example.com、www.example.com 和 *.api.example.com；最后一个覆盖 v1.api.example.com，但不覆盖 api.example.com 本身。': 'Choose Example to load the public demo PEM. Its SANs are demo.example.com, www.example.com and *.api.example.com. The wildcard covers v1.api.example.com but not api.example.com itself.',
    '到期时间是 2028-07-21 02:04:54 UTC，结果栏按你的本地时间显示。有效期只说明日期范围；本工具不验证信任链。': 'It expires at 2028-07-21 02:04:54 UTC. The results show your local time. Being within this interval does not establish trust; this decoder does not verify the chain.',
    '证书指纹是对 DER 字节计算的摘要，直接对带有换行的 PEM 文本计算会得到不同结果。': 'The certificate fingerprint is a hash of the DER bytes. Hashing the PEM text with its line breaks produces a different digest.',
    '比较文本与文件的 SHA-256 摘要': 'Compare SHA-256 digests of text and files'
  },
  'date-calculator': {
    '从周五到周一，算几天？': 'How many days from Friday to Monday?',
    '以 2024-03-01（周五）到 2024-03-04（周一）为例：不含周五、含周一是 3 个自然日、1 个工作日；两端都含则是 4 个自然日、2 个工作日。': 'From Friday, 2024-03-01 to Monday, 2024-03-04: exclude Friday and include Monday for 3 calendar days and 1 weekday. Include both for 4 calendar days and 2 weekdays.',
    '试算跨周末日期': 'Try the weekend example',
    '可切换上方两个选项核对结果。这里的工作日只按周一至周五计算，不套用任何地区的节假日或调休表。': 'Toggle the checkboxes above to compare. Business days here are Monday through Friday; regional holidays and substitute workdays are not applied.',
    '需要比较不同时区的具体时刻？': 'Compare times across time zones'
  },
  'aes-tool': {
    '输出格式：zkaes1: + Base64(salt ‖ iv ‖ 密文)，自包含参数，凭同一密码即可解密。': 'Output format: zkaes1: + Base64(salt ‖ iv ‖ ciphertext). All parameters are included; use the same password to decrypt.'
  },
  'chmod-calculator': { '读 r (4)': 'Read r (4)', '写 w (2)': 'Write w (2)', '执行 x (1)': 'Execute x (1)' },
  'cron-tool': { 'Cron 表达式（5 段）': 'Cron expression (5 fields)', 'Cron 表达式': 'Cron expression' },
  'css-length-unit': { '单位对照表': 'Unit reference', '绝对单位': 'Absolute units', '相对单位': 'Relative units', '计算值 (px)': 'Computed value (px)', '英寸 (1in = 96px)': 'Inch (1in = 96px)', '派卡 (1pc = 16px)': 'Pica (1pc = 16px)', '我的博客：': 'My blog: ', '丿似锦': 'zktww' },
  'device-info': { 'screen 尺寸': 'Screen dimensions', 'safe-area 安全区': 'Safe-area insets', '语言 language(s)': 'Languages', '触点数 maxTouchPoints': 'Maximum touch points', '网络 connection': 'Network connection' },
  'drag-and-drop-playground': {
    '上下拖动以重排。核心是用': 'Drag items to reorder. Use',
    '计算光标相对每个兄弟元素的位置，\n            配合': 'to locate the pointer relative to each sibling, and',
    '排除自身，在': 'to exclude the dragged item. During', '中实时': 'events, reorder with',
    '把任意文件拖入下方虚线区域，或点击选择。示例': 'Drop files below or click to select. This demonstrates'
  },
  'id-card-checker': {
    '身份证校验码计算器': 'Chinese ID Checksum Calculator',
    '输入前 17 位计算末位校验码，或粘贴完整 18 位号码进行校验。计算在本地完成，输入不会保存或上传。': 'Enter the first 17 digits to calculate the final checksum character, or paste a complete 18-character number to verify it. The calculation runs locally; input is not saved or uploaded.',
    '输入身份证号码': 'Enter ID number',
    '17 位或完整 18 位号码': '17 digits or a complete 18-character number',
    '例如：11010519491231002': 'For example: 11010519491231002',
    '仅用于计算校验码，不会写入草稿、分享链接或网络请求。': 'Used only to calculate the checksum; never saved to drafts, shared links, or network requests.',
    '示例 17 位': '17-digit example',
    '示例 18 位': '18-digit example',
    '校验结果': 'Verification result',
    '输入 17 位或 18 位号码后显示结果。': 'Enter 17 or 18 characters to see the result.',
    '计算出的校验码': 'Calculated checksum',
    '标准完整号码': 'Standard full number',
    '关于身份证校验码': 'About ID checksums',
    '本工具依据 GB 11643-1999 的加权求和与模 11 映射规则计算第 18 位校验码。它只能发现部分录入错误，不能证明号码真实签发、归属某个人或包含有效的地址与出生日期。': 'This tool calculates the 18th checksum character with the weighted-sum and modulo-11 mapping rules from GB 11643-1999. It can detect some input errors, but cannot prove that a number was issued, belongs to a person, or contains a valid address or date of birth.',
    '输入完整号码会发生什么？': 'What happens when I enter a complete number?',
    '工具会重新计算第 18 位，并与输入的最后一位比较，显示校验通过或不一致。完整号码只在当前页面内处理。': 'The tool recalculates the 18th character and compares it with the final character you entered. The complete number is processed only on this page.',
    '支持 15 位身份证号吗？': 'Are 15-digit ID numbers supported?',
    '15 位号码不能直接计算 18 位校验码。请先按规则补齐出生年份和校验位后再核对，本工具不会替你推断或保存身份信息。': 'A 15-digit number cannot be used directly to calculate an 18-digit checksum. Expand it according to the applicable rules before checking; this tool will not infer or save identity information.'
  },
  'emoji-tool': { '收藏与最近使用保存在本机浏览器（localStorage）。': 'Favorites and recent emoji are saved in this browser (localStorage).' },
  'http-reference': { '共': 'Total:', '条 · 点击条目复制': 'entries · Click an entry to copy' },
  'json-formatter': {
    '快捷键：': 'Shortcut: ', '美化当前输入 · 输入内容自动保存至本地，刷新不丢失。': 'Format input · Drafts are saved locally and survive a refresh.',
    '仅使用浏览器原生': 'Uses the browser-native', '，数据全程本地处理，不上传服务器；不支持 JSON5 / 尾逗号等非标准语法。': 'parser. All processing is local. JSON5, trailing commas, and other non-standard syntax are not supported.'
  },
  'jwt-decoder': { '复制 Header': 'Copy header', '复制 Payload': 'Copy payload' },
  'keypair-generator': { '选择算法后点击「生成密钥对」。': 'Choose an algorithm, then click Generate key pair.' },
  'mermaid-editor': {
    'default（浅色）': 'default (light)', 'dark（深色）': 'dark (dark)', '也可以从上方模板库选择一个示例': 'Or choose an example from the templates above.',
    '，支持流程图、时序图、类图、状态图、ER 图、甘特图、饼图、思维导图等。': 'Supports flowcharts, sequence, class, state and ER diagrams, Gantt charts, pie charts, mind maps, and more.',
    '缩进 · 滚轮缩放预览 · 拖拽平移': 'Indent · Mouse wheel to zoom · Drag to pan'
  },
  'radix-converter': { '八进制 (Base 8)': 'Octal (Base 8)', '自定义进制结果': 'Custom base result' },
  'sensor-viewer': { '方向 DeviceOrientation': 'Orientation · DeviceOrientation', '加速度 DeviceMotion': 'Acceleration · DeviceMotion', '含重力 x / y / z（m/s²）': 'Including gravity x / y / z (m/s²)', '不含重力 x / y / z（m/s²）': 'Excluding gravity x / y / z (m/s²)' },
  'timestamp-converter': { '一': 'Mon', '二': 'Tue', '三': 'Wed', '四': 'Thu', '五': 'Fri', '六': 'Sat', '日': 'Sun' },
  'timezone-planner': { '边缘 7:00-9:00 / 18:00-22:00': 'Outside core hours 7:00–9:00 / 18:00–22:00' },
  'touch-tester': { 'pressure 压力': 'Pressure', 'tiltX / tiltY 倾角': 'Tilt X / Y', 'twist 旋转': 'Twist' },
  'us-address-generator': {
    '筛选与生成设置': 'Filter & Generation Options',
    '快捷地区筛选': 'Quick state filters',
    '全部随机': 'All states',
    '免税州随机 (0% 税)': 'Tax-free states (0%)',
    'OR 俄勒冈': 'OR Oregon',
    'DE 特拉华': 'DE Delaware',
    'MT 蒙大拿': 'MT Montana',
    'NH 新罕布什尔': 'NH New Hampshire',
    'AK 阿拉斯加': 'AK Alaska',
    'CA 加州': 'CA California',
    'NY 纽约': 'NY New York',
    'TX 得州': 'TX Texas',
    '州 / 地区': 'State / Region',
    '选择美国州或地区': 'Select a US state or region',
    '性别倾向': 'Gender',
    '选择性别倾向': 'Select gender preference',
    '女 (Female)': 'Female',
    '男 (Male)': 'Male',
    '二级单元号': 'Address Line 2',
    '二级单元号设置': 'Address line 2 option',
    '包含 Suite / Ste': 'Include Suite / Ste',
    '不含单元号': 'No unit number',
    '号码规则': 'Phone format',
    '电话号码生成规则': 'Phone number format rule',
    '标准号码 (过主流校验)': 'Standard (passes validation)',
    '555-01XX (测试保留段)': '555-01XX (reserved test range)',
    '邮箱域名': 'Email domain',
    '选择邮箱域名': 'Select email domain',
    '@example.com (测试域名)': '@example.com (RFC test domain)',
    '生成新地址': 'Generate address',
    '复制邮寄地址': 'Copy USPS block',
    '复制 JSON': 'Copy JSON',
    '批量生成': 'Batch export',
    '点击下方任意字段行即可一键复制对应内容。': 'Click any field row below to copy its value.',
    '街道与邮寄地址': 'Street & Mailing Address',
    '免税州 · 0% 州销售税': 'Tax-Free · 0% State Sales Tax',
    '街道地址 (Address Line 1)': 'Address Line 1',
    '单元号 (Address Line 2)': 'Address Line 2',
    '城市 (City)': 'City',
    '县 / 郡 (County)': 'County',
    '州全称 (State)': 'State',
    '州缩写 (State Code)': 'State Code',
    '邮政编码 (ZIP Code)': 'ZIP Code',
    '扩展邮编 (ZIP+4)': 'ZIP+4',
    '国家 / 地区 (Country)': 'Country',
    '联系人与区域信息': 'Contact & Locale',
    '全名 (Full Name)': 'Full Name',
    '名 (First Name)': 'First Name',
    '姓 (Last Name)': 'Last Name',
    '性别 (Gender)': 'Gender',
    '出生日期 (MM/DD/YYYY)': 'Date of Birth (MM/DD/YYYY)',
    '电话号码 (Phone)': 'Phone',
    '纯数字电话 (10 Digits)': 'Phone (10 digits)',
    '电子邮箱 (Email)': 'Email',
    '时区 (Time Zone)': 'Time Zone',
    '标准邮寄格式 (USPS)': 'USPS Mailing Format',
    '批量生成与导出': 'Batch Generation & Export',
    '数量': 'Count',
    '批量生成条数': 'Batch record count',
    '导出格式': 'Export format',
    '批量导出格式': 'Batch export format',
    'JSON 数组': 'JSON array',
    'CSV 表格': 'CSV table',
    'USPS 多行文本': 'USPS mailing text',
    '生成批量数据': 'Generate batch',
    '复制批量结果': 'Copy batch output',
    '下载文件': 'Download file'
  }
};

// Runtime messages stay tool-scoped too; do not apply these short words to data
// algorithms such as formal Chinese currency conversion.
export const toolScriptEn = {
  'cert-decoder': {
    'DER 数据不完整（偏移 ': 'Incomplete DER data (offset ', '不支持多字节 tag': 'Multi-byte tags are not supported',
    '非法的 length 编码': 'Invalid length encoding', '长度越界：声明 ': 'Length out of bounds: ', ' 字节超出数据范围': ' bytes exceed the input',
    '（空）': '(empty)', '不是有效的 X.509 证书结构': 'Invalid X.509 certificate structure',
    ' 位': ' bits', '曲线 ': 'Curve ', '已过期 ': 'Expired; days overdue: ', '尚未生效': 'Not yet valid',
    '有效，剩余 ': 'Within validity period; days left: ', ' 天</b>': '</b>', '（主体与签发者同名）': ' (subject and issuer names match)',
    '>证书 ': '>Certificate ', '概要': 'Overview', '主体 CN：': 'Subject CN: ', '签发者 CN：': 'Issuer CN: ',
    '生效时间：': 'Not before: ', '到期时间：': 'Not after: ', '主体（Subject DN）': 'Subject DN', '签发者（Issuer DN）': 'Issuer DN',
    'SAN 备用名称（': 'Subject alternative names (', ' 个）': ')', 'SAN 备用名称': 'Subject alternative names',
    '未包含 subjectAltName 扩展': 'No subjectAltName extension', '公钥': 'Public key', '签名算法': 'Signature algorithm',
    '（版本 v': ' (version v', '序列号': 'Serial number', ' 指纹': ' fingerprint', '计算中...': 'Calculating…',
    '当前环境不支持 Web Crypto（需 HTTPS）': 'Web Crypto is unavailable (HTTPS required)', '指纹计算失败': 'Fingerprint calculation failed',
    '请先粘贴 PEM 证书内容': 'Paste a PEM certificate first',
    '检测到私钥内容——本工具只解析公开证书，请不要粘贴私钥': 'Private key detected. Paste public certificates only, never private keys.',
    '未找到 -----BEGIN CERTIFICATE----- 块，请确认是 PEM 格式（DER 需先用 openssl 转 PEM）': 'No -----BEGIN CERTIFICATE----- block found. Convert binary DER to PEM first.',
    '解析失败': 'Could not parse', '证书内容损坏或不是有效的 DER 编码': 'Invalid certificate or DER encoding',
    '解析成功：共 ': 'Certificates parsed: ', ' 张证书': '', '解析完成：': 'Finished: ', ' 张成功，': ' parsed, ', ' 张失败': ' failed',
    '粘贴证书后点击「解析」，或点「示例」查看效果。': 'Paste a certificate and choose Parse, or choose Example to load the demo.',
    '）': ')', '，': ', '
  },
  'json-formatter': {
    '检测到超出安全整数范围的大数，数值可能已丢失精度。': 'A number exceeds the safe-integer range and may have lost precision.',
    '请输入 JSON 文本。': 'Enter JSON text.', '解析失败（第 ': 'Parse failed (line ', ' 行，第 ': ', column ', ' 列）：': '): ', '\\n出错位置附近：…': '\\nNear the error: …',
    '解析失败：': 'Parse failed: ', '…（共 ': '… (total: ', ' 字符）': ' characters)', ' 项 ]': ' items ]', ' 键 }': ' keys }', '显示更多（剩余 ': 'Show more (remaining: ', ' 项）': ' items)',
    '已压缩': 'Minified', '已美化': 'Formatted', 'JSON 合法 ✓ 共 ': 'Valid JSON ✓ Keys: ', ' 个键，最大深度 ': '; maximum depth: ',
    '输入为空。': 'Input is empty.', '已转义为 JSON 字符串字面量': 'Escaped as a JSON string literal', '去转义失败：内容不是合法的 JSON 转义字符串。': 'Unescape failed: input is not a valid JSON string literal.',
    '已去转义': 'Unescaped', '复制失败，请手动全选复制。': 'Copy failed. Select and copy the result manually.', '结果为空，请先美化或压缩。': 'No output. Format or minify the input first.', '完成': 'Done'
  },
  'hash-tool': {
    'MD5 计算出错': 'MD5 calculation failed', '>复制</button>': '>Copy</button>', '计算中...': 'Calculating…', ' 字节）计算完成': ' bytes) calculated',
    '计算失败：': 'Calculation failed: ', '文件超过 256MB，请换小一点的文件': 'File exceeds 256 MB. Choose a smaller file.', '文本': 'Text', '文件 ': 'File '
  },
  'jwt-decoder': {
    '过期时间': 'Expires at', '签发时间': 'Issued at', '生效时间': 'Not before', '天': ' days ', '小时': ' hours ', '分钟': ' minutes ', '后': ' from now', '前': ' ago',
    '请粘贴公钥而非私钥': 'Paste the public key, not the private key', '不是有效的 JWT：应为 header.payload.signature 三段': 'Invalid JWT: expected header.payload.signature',
    'Header 解码失败：': 'Header decoding failed: ', 'Payload 解码失败：': 'Payload decoding failed: ', '已过期': 'Expired', '未过期': 'Not expired', '尚未生效': 'Not yet valid',
    '填入密钥（HS）或公钥（RS/ES）可本地校验签名': 'Enter a secret (HS) or public key (RS/ES) to verify locally', '暂不支持 alg=': 'Unsupported algorithm: ',
    ' 的本地验签（支持 HS / RS / ES 系列）': ' (local verification supports HS / RS / ES)', '签名有效（': 'Valid signature (',
    '签名无效（密钥不匹配或 Token 被篡改）': 'Invalid signature (wrong key or modified token)', '验签失败：': 'Verification failed: ', '密钥格式无法解析': 'Unrecognized key format'
  },
  'aes-tool': { '未知错误': 'Unknown error', '隐藏': 'Hide', '显示': 'Show' },
  'curl-parser': {
    '-k 跳过证书': '-k skip certificate validation', '-L 跟随跳转': '-L follow redirects', '（未识别）': '(unrecognized)', '方法: ': 'Method: ', 'Query 参数': 'Query parameters',
    '>名称<': '>Name<', '>值<': '>Value<', 'Basic 认证': 'Basic authentication', '表单字段（-F）': 'Form fields (-F)', '>字段<': '>Field<',
    ' 是文件字段（': ' is a file field (', '），请改为 File/Blob 对象': '); replace it with a File/Blob object',
    '// 注意：浏览器 fetch 无法跳过 TLS 证书校验（-k）': '// Browser fetch cannot skip TLS certificate validation (-k)',
    '// 注意：浏览器会自动处理压缩，无需 --compressed': '// Browsers handle compression automatically; --compressed is unnecessary',
    '粘贴 curl 命令后自动解析，全部本地完成。': 'Paste a curl command to parse it locally.', '解析完成：': 'Parsed: ', '解析失败：': 'Parse failed: ', 'fetch 代码': 'fetch code'
  },
  'keypair-generator': {
    '当前环境不支持 Web Crypto API（需要 HTTPS 或 localhost）。': 'Web Crypto is unavailable. Use HTTPS or localhost.', '正在生成 ': 'Generating ', ' 密钥对，请稍候…': ' key pair. Please wait…',
    '生成完成（': 'Generated (', '，耗时 ': ', elapsed: ', ' ms）。请妥善保管私钥。': ' ms). Keep the private key secure.',
    '生成失败：当前浏览器可能不支持 Ed25519，请更新浏览器或改用 ECDSA。（': 'Generation failed. Ed25519 may be unsupported; update your browser or use ECDSA. (', '生成失败：': 'Generation failed: ', '请先生成密钥对。': 'Generate a key pair first.', '已开始下载 ': 'Download started: ', '公钥': 'Public key', '私钥': 'Private key'
  },
  'cron-tool': { '分钟': 'minute', '小时': 'hour', '日期': 'day of month', '月份': 'month', '星期': 'day of week' },
  'color-tool': { '无法识别颜色': 'Unrecognized color', 'AAA 通过': 'AAA pass', 'AA 通过': 'AA pass', '不达标': 'Fail', '普通正文（≥4.5:1）：': 'Normal text (≥4.5:1): ', '大字号（≥3:1）：': 'Large text (≥3:1): ' },
  'json-diff': { '第 ': 'Line ', ' 行附近': ' nearby', ' 解析失败': ' parse failed', '新增': 'Added', '删除': 'Removed', '修改': 'Changed', '类型变化': 'Type changed', '(根)': '(root)', '共 ': 'Total: ', ' 项差异': ' differences' },
  'yaml-converter': { '第 ': 'Line ', ' 行第 ': ', column ', ' 列：': ': ', '数组（': 'array (', ' 项）': ' items)', '对象（': 'object (', ' 个键）': ' keys)', 'YAML 解析失败：': 'YAML parsing failed: ', '请输入 YAML 内容': 'Enter YAML content', '顶层类型：': 'Root type: ', '输入内容后自动校验 YAML 语法。': 'Enter content to validate YAML automatically.', '，顶层为 ': '; root type: ' },
  'url-codec': { '暂无参数': 'No parameters', '未识别到查询参数': 'No query parameters found', '没有可解析的查询参数': 'No query parameters to parse', '已解析 ': 'Parsed ', ' 个参数': ' parameters', '已使用 encodeURIComponent 编码': 'Encoded with encodeURIComponent', '解码完成': 'Decoded', '解码失败：': 'Decoding failed: ' },
  'base64-converter': { '未识别到 \\\\u 转义序列': 'No Unicode escape sequence found', '完成': 'Done' },
  'device-info': {
    '不支持': 'Unsupported', '未知': 'Unknown', ' 核': ' cores', ' GB（近似）': ' GB (approximate)', '精确（鼠标/触控板）': 'Fine (mouse/trackpad)', '粗糙（触屏）': 'Coarse (touch)', '无指针设备': 'No pointer device',
    '深色': 'Dark', '浅色': 'Light', ' / 省流量': ' / data saver', '在线': 'Online', '离线': 'Offline', '已启用': 'Enabled', '已禁用': 'Disabled', ' / 充电中': ' / charging', ' / 未充电': ' / not charging', '读取失败': 'Read failed', 'zktool 设备信息（': 'zktool device information (', '全部信息已复制到剪贴板': 'All information copied', '"是"': '"Yes"', '"否"': '"No"'
  },
  'timezone-planner': {
    '北京': 'Beijing', '东京': 'Tokyo', '首尔': 'Seoul', '新加坡': 'Singapore', '新德里（印度）': 'New Delhi (India)', '迪拜': 'Dubai', '悉尼': 'Sydney', '奥克兰': 'Auckland', '莫斯科': 'Moscow', '柏林': 'Berlin', '巴黎': 'Paris', '伦敦': 'London', '圣保罗': 'São Paulo', '纽约': 'New York', '芝加哥': 'Chicago', '多伦多': 'Toronto', '旧金山': 'San Francisco',
    '周日': 'Sun', '周一': 'Mon', '周二': 'Tue', '周三': 'Wed', '周四': 'Thu', '周五': 'Fri', '周六': 'Sat', '工作时间': 'Working hours', '边缘时间': 'Outside core hours', '休息时间': 'Off hours',
    '基准时间无效，请重新选择日期时间。': 'Invalid base time. Select the date and time again.', '删除': 'Remove ', '基准 ': 'Base ', '已添加的城市保存在本机浏览器，下次打开自动恢复。': 'Added cities are saved in this browser and restored next time.', '全部城市都已添加。': 'All cities have been added.'
  }
};
