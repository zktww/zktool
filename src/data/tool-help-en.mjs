// Comprehensive English SEO copy, search-intent titles, and structured FAQs for all 44 local tools.
export const toolHelpEn = {
  'timestamp-converter': {
    title: 'Unix Timestamp Converter - Epoch to Date & Time Zone Tool | zktool',
    intro: 'Convert Unix epoch timestamps (seconds or milliseconds) to human-readable ISO 8601 and local dates, or convert calendar dates back to Unix timestamps. Supports batch line-by-line conversion, live current epoch readout, and instant comparison across global IANA time zones — 100% locally in your browser.',
    faqs: [
      ['How do I tell Unix seconds apart from milliseconds?', 'A 10-digit integer (such as 1731900000) represents seconds since 1970-01-01T00:00:00Z, while a 13-digit integer represents milliseconds. Auto-detect mode inspects the digit count automatically.'],
      ['Does a Unix timestamp depend on my time zone?', 'No. Unix epoch time always counts elapsed seconds from UTC midnight on January 1, 1970. Only the formatted calendar date and clock time change depending on the selected time zone.'],
      ['What is the Year 2038 problem?', 'Legacy 32-bit signed integers overflow on 2038-01-19T03:14:07Z (2,147,483,647 seconds). Modern 64-bit systems and JavaScript numbers safely handle dates far beyond 2038.']
    ]
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator - Online JSON Beautifier & Tree View | zktool',
    intro: 'Validate, pretty-print, minify, sort keys, escape, and inspect JSON payloads with syntax highlighting and an interactive collapsible tree view. Built on native browser JSON.parse with exact line-and-column error pinpointing and big-integer precision warnings; your payloads never leave your device.',
    faqs: [
      ['Why does valid JavaScript object syntax fail JSON validation?', 'Strict RFC 8259 JSON requires double-quoted keys and strings, forbids trailing commas, and does not allow comments, undefined, or single quotes.'],
      ['Why did a long 64-bit ID change its last digits?', 'IEEE-754 double-precision numbers in JavaScript lose integer precision above Number.MAX_SAFE_INTEGER (9,007,199,254,740,991). Keep 64-bit Snowflake or database IDs serialized as strings.'],
      ['Is my API response uploaded to a server?', 'Never. Formatting, minification, key sorting, and tree rendering run entirely in your browser tab with zero network requests.']
    ]
  },
  'emoji-tool': {
    title: 'Emoji Picker & Unicode Copy Tool - Browse, Skin Tones & Codes | zktool',
    intro: 'Search and browse standard Unicode emojis by English or Chinese keywords, switch Fitzpatrick skin-tone modifiers, inspect hex code points and shortcodes, and copy characters with a single click. Favorites and recent picks are saved locally in your browser.',
    faqs: [
      ['Why does an emoji look different across Windows, macOS, iOS, and Android?', 'Unicode standardizes only the abstract code point and meaning, while each operating system ships its own color emoji font (Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji).'],
      ['How do skin-tone modifiers work in Unicode?', 'Skin-tone emojis combine a base human emoji with one of five Fitzpatrick modifier code points (U+1F3FB through U+1F3FF) so the sequence renders as a single glyph.'],
      ['Why do some compound emojis split into multiple characters?', 'Family, profession, and flag emojis join multiple code points using Zero-Width Joiners (U+200D) or regional indicator pairs. Older fonts without ZWJ support display the parts separately.']
    ]
  },
  'mermaid-editor': {
    title: 'Mermaid Live Editor - Online Flowchart & Sequence Diagram Maker | zktool',
    intro: 'Write and preview Mermaid diagrams in real time, including flowcharts, sequence diagrams, class diagrams, state machines, ER models, Gantt charts, and mind maps. Includes starter templates, pan-and-zoom canvas controls, URL state sharing, and crisp SVG or high-DPI PNG export.',
    faqs: [
      ['Should I export SVG or PNG for documentation?', 'Export SVG for web pages, wikis, and PDFs where infinite vector sharpness matters; export PNG when pasting into slide decks, chat apps, or issue trackers that block inline SVG.'],
      ['What information is stored in a shared link?', 'Shared URLs Base64-encode your Mermaid source inside the URL hash (#zk=...). Nothing is stored on a server, but anyone with the link can read the diagram text.'],
      ['Why did a node label with parentheses cause a syntax error?', 'Parentheses and brackets have special shape meanings in Mermaid flowcharts. Wrap labels containing special characters in double quotes, such as A["Step (Optional)"].']
    ]
  },
  'url-codec': {
    title: 'URL Encoder & Decoder - Online Percent-Encoding & Query Parser | zktool',
    intro: 'Encode and decode URLs and URI components with full UTF-8 safety, inspect query strings in a structured key-value table, and convert between URLSearchParams strings and JSON objects. Ideal for debugging webhook callbacks, OAuth redirects, and API query parameters.',
    faqs: [
      ['What is the difference between encodeURI and encodeURIComponent?', 'encodeURI preserves reserved URL delimiters (: / ? # & =) so a full URL stays intact, whereas encodeURIComponent encodes delimiters too and should be used on individual query parameter values.'],
      ['Why are spaces sometimes encoded as + instead of %20?', 'HTML form submissions (application/x-www-form-urlencoded) encode spaces as +, while RFC 3986 URI percent-encoding uses %20. Toggle the + option when decoding form query strings.'],
      ['Is URL encoding a form of encryption?', 'No. Percent-encoding only makes non-ASCII and reserved characters safe for transport in URLs and can be decoded by anyone without a key.']
    ]
  },
  'base64-converter': {
    title: 'Base64 Encoder & Decoder - UTF-8 Text, Hex & Unicode Converter | zktool',
    intro: 'Encode and decode UTF-8 text to and from Base64, hexadecimal byte strings, and \\uXXXX Unicode escape sequences without garbling multi-byte characters or emojis. Displays live character and UTF-8 byte counts entirely in your browser.',
    faqs: [
      ['Why does window.btoa() throw an error on non-ASCII text?', 'Native btoa() only accepts Latin-1 single-byte characters. This tool encodes strings to UTF-8 bytes via TextEncoder first so CJK text and emojis round-trip cleanly.'],
      ['How much larger is Base64 compared to raw binary?', 'Base64 maps every 3 bytes (24 bits) into 4 ASCII characters, increasing payload size by roughly 33% plus optional = padding characters.'],
      ['Does Base64 protect sensitive credentials?', 'No. Base64 is a public binary-to-text encoding (such as in HTTP Basic Auth headers), not encryption. Always use TLS and proper encryption for secrets.']
    ]
  },
  'regex-tester': {
    title: 'Regex Tester & Debugger - Live JavaScript Regular Expression Tool | zktool',
    intro: 'Test and debug JavaScript regular expressions in real time with visual match highlighting, numbered and named capture group inspection, flag toggles (g, i, m, s, u), replacement preview, and catastrophic-backtracking timeout protection.',
    faqs: [
      ['Why does my PCRE or Python regex behave differently here?', 'This tester runs on the standard ECMAScript (JavaScript) RegExp engine. Certain PCRE features like atomic groups or recursive patterns are not part of JavaScript RegExp.'],
      ['What happens if a pattern triggers catastrophic backtracking?', 'Execution runs with a watchdog timeout in a background worker context and aborts runaway backtracking before it can freeze your browser tab.'],
      ['How do I reference capture groups in the replacement field?', 'Use $1, $2 for numbered capture groups, $<name> for named groups (?<name>...), $& for the entire match, and $$ for a literal dollar sign.']
    ]
  },
  'random-generator': {
    title: 'UUID v4 & Password Generator - Secure Crypto Random String Tool | zktool',
    intro: 'Generate cryptographically strong UUID v4 identifiers, high-entropy passwords, URL-safe API tokens, numeric PINs, and custom-alphabet strings in batches up to 200 items. Powered by browser Web Crypto (crypto.getRandomValues) with rejection sampling to eliminate modulo bias.',
    faqs: [
      ['Why use crypto.getRandomValues instead of Math.random()?', 'Math.random() is a predictable pseudo-random generator unsuitable for security credentials. Web Crypto draws from the operating system CSPRNG.'],
      ['Can two randomly generated UUID v4 values collide?', 'A UUID v4 contains 122 random bits. You would need to generate roughly 2.71 quintillion UUIDs to reach even a 50% collision probability.'],
      ['How many bits of entropy make a strong password?', 'Aim for at least 80 bits of entropy for user accounts and 128+ bits for API keys and master secrets. The live badge calculates length × log2(alphabet size) automatically.']
    ]
  },
  'cron-tool': {
    title: 'Cron Expression Parser - Explain Crontab & Next 10 Run Times | zktool',
    intro: 'Parse standard 5-field Linux crontab expressions (minute, hour, day of month, month, day of week), inspect human-readable field breakdowns, and preview the exact next 10 scheduled execution timestamps in your local time zone.',
    faqs: [
      ['What are the five fields in a standard crontab expression?', 'From left to right: Minute (0–59), Hour (0–23), Day of Month (1–31), Month (1–12), and Day of Week (0–7, where both 0 and 7 represent Sunday).'],
      ['How do step (/) and range (-) operators work together?', 'A pattern like */15 in the minute field runs every 15 minutes (0, 15, 30, 45), while 9-17/2 in the hour field runs every 2 hours between 9:00 and 17:00.'],
      ['Why are 6-field or 7-field Quartz expressions rejected?', 'Quartz, Spring, and AWS EventBridge add a seconds or year field and special ?/L/W tokens. This parser targets standard POSIX 5-field crontab syntax.']
    ]
  },
  'color-tool': {
    title: 'Color Converter & WCAG Contrast Checker - HEX, RGB, HSL Shades | zktool',
    intro: 'Convert colors seamlessly between HEX, RGB, and HSL notations, generate a 10-step tint-and-shade palette, and verify foreground/background contrast ratios against WCAG 2.1 AA and AAA accessibility thresholds for normal and large text.',
    faqs: [
      ['What contrast ratio is required for WCAG AA and AAA compliance?', 'WCAG 2.1 AA requires at least 4.5:1 for normal body text and 3:1 for large text (18pt+ or 14pt bold). AAA raises the bar to 7:1 for normal text and 4.5:1 for large text.'],
      ['When is HSL easier to work with than HEX or RGB?', 'HSL separates Hue (0–360°), Saturation, and Lightness, making it effortless to derive hover states, muted borders, and dark-mode surface scales from one brand hue.'],
      ['Does passing contrast guarantee full visual accessibility?', 'Contrast covers luminance legibility, but accessible UI should also avoid relying on color alone to convey status—pair red/green states with icons or text labels.']
    ]
  },
  'text-diff': {
    title: 'Online Text Diff Checker - Side-by-Side Line Comparison Tool | zktool',
    intro: 'Compare two text snippets, configuration files, code blocks, or log outputs line by line to highlight added, removed, and unchanged lines. Runs 100% locally in your browser so proprietary source code and production configs never leave your machine.',
    faqs: [
      ['Are my config files or code snippets uploaded anywhere?', 'No. The LCS diff algorithm executes entirely inside your browser memory with zero server communication.'],
      ['Does whitespace or trailing spaces count as a line change?', 'Yes. Line-level comparison checks exact character equality on each line, making it easy to spot accidental indentation changes or trailing spaces in YAML and ENV files.'],
      ['How can I reverse the comparison direction quickly?', 'Click Swap sides to exchange the original (left) and modified (right) inputs and recompute additions vs. deletions immediately.']
    ]
  },
  'hash-tool': {
    title: 'Online Hash Calculator - MD5, SHA-1, SHA-256 & SHA-512 File Checksum | zktool',
    intro: 'Compute MD5, SHA-1, SHA-256, and SHA-512 cryptographic digests for text strings or local files via drag-and-drop. File hashing runs directly against local ArrayBuffers in your browser without uploading a single byte.',
    faqs: [
      ['Can a SHA-256 or MD5 hash be decrypted back to the original text?', 'No. Cryptographic hash functions are one-way digests—not encryption. Anyone matching a hash uses precomputed rainbow tables or brute-force guessing.'],
      ['Which hash algorithm should I use today?', 'Use SHA-256 or SHA-512 for file integrity verification and digital signatures. MD5 and SHA-1 suffer from practical collision attacks and should only be used for legacy checksums.'],
      ['Should I hash user passwords directly with SHA-256?', 'No. Fast hashes are vulnerable to GPU brute-forcing. Always use a dedicated slow, salted key-derivation function such as Argon2id, bcrypt, scrypt, or PBKDF2.']
    ]
  },
  'jwt-decoder': {
    title: 'JWT Decoder & Verifier - Inspect Header, Payload & HS/RS/ES Signature | zktool',
    intro: 'Decode JSON Web Tokens (JWS) locally to inspect JOSE headers, payload claims, and human-readable exp/iat/nbf timestamps, and optionally verify HMAC (HS256/384/512), RSA (RS256/PS256), or ECDSA (ES256/384) signatures using Web Crypto without sending tokens over the network.',
    faqs: [
      ['Is pasting a production JWT into an online tool safe?', 'Never paste live bearer tokens into server-backed websites. This tool processes tokens strictly in local browser memory with draft saving disabled by default unless you opt in.'],
      ['Does decoding a JWT mean its claims are authentic?', 'No. The header and payload are merely Base64URL-encoded JSON. Anyone can forge claims unless the recipient verifies the cryptographic signature and checks iss, aud, and exp.'],
      ['What key format should I supply to verify RS256 or ES256?', 'Provide the issuer public key in SPKI PEM format (-----BEGIN PUBLIC KEY-----) or as a JWK JSON object. For HS256, enter the shared HMAC secret string.']
    ]
  },
  'json-converter': {
    title: 'JSON Converter - JSON to YAML, TypeScript Interface, Go Struct & CSV | zktool',
    intro: 'Transform JSON documents into clean YAML configs, TypeScript interfaces, Go struct definitions with json tags, or RFC 4180 CSV spreadsheets in one click. Everything runs locally in your browser for instant scaffolding and data export.',
    faqs: [
      ['What JSON structure is required for CSV export?', 'CSV conversion expects a top-level array of flat or consistent objects, such as [{"id":1,"name":"Ada"},{"id":2,"name":"Alan"}], where object keys become column headers.'],
      ['Are generated TypeScript interfaces and Go structs production-complete?', 'They infer types from the sample payload you paste. Always review nullable fields, union types, empty arrays, and integer vs. float distinctions against your API contract.'],
      ['Are nested objects supported when converting JSON to TypeScript or Go?', 'Yes. Nested objects and arrays of objects are extracted into typed child structures automatically.']
    ]
  },
  'text-case': {
    title: 'Case Converter & Line Sorter - camelCase, snake_case & Deduplicate | zktool',
    intro: 'Convert identifier naming styles between camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE, or clean up multi-line lists with A–Z / Z–A sorting, deduplication, line reversal, blank-line removal, and live character/line counts.',
    faqs: [
      ['How does word splitting handle mixed identifiers like getHTTPResponseCode?', 'The tokenizer detects boundaries between lowercase-to-uppercase transitions, acronym runs, underscores, hyphens, and spaces before rejoining words in your target convention.'],
      ['Can I chain multiple operations such as trim, deduplicate, and sort?', 'Yes. Run one operation, click Replace input with result to promote the output to the input box, and apply the next transformation.'],
      ['Does deduplication preserve the original line order?', 'Yes. Deduplicate keeps the first occurrence of each unique line in its original order and removes subsequent duplicates.']
    ]
  },
  'image-compressor': {
    title: 'Online Image Compressor & Converter - Local WebP, JPEG & PNG Tool | zktool',
    intro: 'Compress and convert images to WebP, JPEG, or PNG locally using the browser Canvas API, optionally downscaling maximum dimensions while comparing before-and-after file sizes side by side. Private photos and assets are never uploaded.',
    faqs: [
      ['Why did converting an image to PNG increase its file size?', 'PNG uses lossless compression and ignores the lossy quality slider. Photographs compress dramatically smaller in WebP or JPEG than in PNG.'],
      ['Which format gives the best web performance?', 'WebP typically achieves 25–35% smaller file sizes than JPEG at equivalent visual quality while also supporting alpha transparency, and is supported by all modern browsers.'],
      ['Does re-encoding via Canvas strip EXIF metadata?', 'Yes. Rendering an image onto an HTML5 Canvas exports pixel data only, naturally stripping camera EXIF and GPS tags from the downloaded file.']
    ]
  },
  'http-reference': {
    title: 'HTTP Status Codes & MIME Types Cheat Sheet - 200, 301, 404, 502 | zktool',
    intro: 'Quickly search standard HTTP response status codes (1xx–5xx) with practical debugging hints alongside common Content-Type MIME mappings and file extensions. Click any status code or MIME string to copy it straight to your clipboard.',
    faqs: [
      ['What is the exact difference between 401 Unauthorized and 403 Forbidden?', '401 means unauthenticated—missing, invalid, or expired credentials. 403 means authenticated (or identity irrelevant) but lacking permission to access the resource.'],
      ['How do I debug 502 Bad Gateway vs. 504 Gateway Timeout?', '502 indicates your reverse proxy (Nginx, Cloudflare, ALB) received an invalid or crashed upstream response; 504 means the upstream server failed to respond before the timeout expired.'],
      ['Which MIME type should I use for binary downloads vs. JSON APIs?', 'Use application/json; charset=utf-8 for JSON responses, and application/octet-stream for generic arbitrary binary downloads.']
    ]
  },
  'unicode-inspector': {
    title: 'Unicode Character Inspector - Find Zero-Width & Invisible Characters | zktool',
    intro: 'Inspect text character by character to view Unicode code points (U+XXXX), UTF-8 and UTF-16 byte sequences, and spot hidden zero-width spaces (U+200B), BOM markers, directional overrides, and confusable homoglyphs — with one-click invisible-character cleanup.',
    faqs: [
      ['Why did a string comparison or JSON parse fail when the text looks clean?', 'Copy-pasting from chat apps, PDFs, or rich editors often sneaks in U+200B (Zero Width Space), U+FEFF (BOM), or U+00A0 (Non-Breaking Space) that break parsers and string matching.'],
      ['Is it always safe to strip all zero-width characters?', 'Strip them safely from code, URLs, and identifiers, but note that U+200D (Zero Width Joiner) is required inside compound emojis and certain complex scripts.'],
      ['What is a homoglyph spoofing attack?', 'Visually identical letters from Cyrillic or Greek blocks (such as Cyrillic а U+0430 vs. Latin a U+0061) can disguise phishing domains (IDN homograph attacks) or malicious identifiers.']
    ]
  },
  'sql-formatter': {
    title: 'Online SQL Formatter & Beautifier - MySQL, PostgreSQL & Standard SQL | zktool',
    intro: 'Beautify or minify complex SQL queries locally in your browser with support for Standard SQL, MySQL, MariaDB, PostgreSQL, SQLite, T-SQL, and BigQuery dialects, configurable indentation, and uppercase/lowercase keyword styling.',
    faqs: [
      ['Does formatting validate database table schemas or run my SQL?', 'No. The formatter parses lexical SQL structure purely for indentation and readability inside your browser without connecting to any database.'],
      ['Are database table names or query literals sent over the network?', 'Never. Production queries, customer filters, and schema names stay 100% inside your local browser tab.'],
      ['What does Minify to one line do to SQL comments?', 'Minification strips -- line comments and /* */ block comments before collapsing whitespace, preventing commented-out clauses from breaking single-line queries!']
    ]
  },
  'yaml-converter': {
    title: 'YAML to JSON Converter & YAML Validator - Online Syntax Checker | zktool',
    intro: 'Convert seamlessly between YAML and JSON in both directions and validate YAML syntax as you type with exact line-and-column error reporting. Perfect for debugging Kubernetes manifests, GitHub Actions workflows, and Docker Compose files locally.',
    faqs: [
      ['Why does YAML reject Tab characters for indentation?', 'The YAML specification mandates spaces for indentation because tab stops vary across editors, which would make structural nesting ambiguous.'],
      ['Why did unquoted NO, ON, or version 3.10 parse unexpectedly in YAML?', 'YAML 1.1 treats bare yes/no/on/off as booleans and unquoted 3.10 as the float 3.1. Always quote version strings ("3.10") and country codes ("NO") in YAML configs.'],
      ['Do YAML comments survive a YAML → JSON → YAML round trip?', 'No. Standard JSON does not support comments, so converting YAML to JSON discards # comments. Keep your original YAML file as the source of truth.']
    ]
  },
  'curl-parser': {
    title: 'cURL to Fetch & Python Requests Converter - Online cURL Parser | zktool',
    intro: 'Paste any cURL command (such as Copy as cURL from Chrome DevTools) to inspect its HTTP method, URL, query parameters, headers, cookies, Basic auth, and request body, and generate ready-to-run JavaScript fetch() and Python requests snippets locally.',
    faqs: [
      ['Are Authorization headers or cookies in my pasted cURL saved or uploaded?', 'Never uploaded, and draft persistence is disabled by default on this sensitive tool so bearer tokens and session cookies are not written to localStorage unless you explicitly opt in.'],
      ['Why can a converted fetch() call fail in the browser when cURL succeeded?', 'Browsers enforce CORS preflight policies and forbid setting restricted headers like Host, Origin, or User-Agent from client-side JavaScript, whereas CLI cURL has no CORS restrictions.'],
      ['Does the parser handle multiline backslash continuations and quoted JSON?', 'Yes. Single quotes, double quotes, ANSI-C $\'...\' escapes, and trailing \\ line continuations from bash/zsh are tokenized accurately.']
    ]
  },
  'html-entities': {
    title: 'HTML Entity Encoder & Decoder - Named, Decimal & Hex Reference | zktool',
    intro: 'Convert reserved HTML characters (&, <, >, ", \') and non-ASCII symbols to and from named (&amp;, &copy;), decimal (&#169;), or hexadecimal (&#xA9;) HTML entities, complete with a searchable click-to-copy entity reference table.',
    faqs: [
      ['When should I use Encode (required only) vs. encoding all characters?', 'For normal HTML text and attributes, escaping only the five syntax-sensitive characters (& < > " \') keeps UTF-8 source readable while preventing markup breakage.'],
      ['Why prefer numeric entities in XML or XHTML?', 'XML predefines only five named entities (&amp;, &lt;, &gt;, &quot;, &apos;). Numeric character references like &#160; work identically in both HTML5 and strict XML parsers.'],
      ['Is HTML entity encoding enough to prevent all XSS vulnerabilities?', 'Entity encoding protects text inside HTML elements and quoted attributes, but untrusted data placed inside href="javascript:...", inline event handlers, or <script> blocks requires context-specific sanitization.']
    ]
  },
  'keypair-generator': {
    title: 'Online RSA, ECDSA & Ed25519 Key Pair Generator - PEM & JWK | zktool',
    intro: 'Generate asymmetric public/private key pairs directly in your browser using the Web Crypto API, supporting RSASSA-PKCS1-v1_5, RSA-PSS (2048/3072/4096-bit), ECDSA (P-256, P-384, P-521), and Ed25519 with one-click SPKI/PKCS#8 PEM and JWK export.',
    faqs: [
      ['Is my private key ever transmitted over the internet?', 'Never. Key generation uses native window.crypto.subtle.generateKey() inside your browser memory and works completely offline.'],
      ['Should I choose RSA, ECDSA P-256, or Ed25519 for new projects?', 'Prefer Ed25519 or ECDSA P-256 (ES256) for compact keys and fast signing; choose RSA-2048 or RSA-3072 when integrating with legacy systems that only support RS256.'],
      ['What PEM formats are exported by this tool?', 'Public keys are exported as standard X.509 SubjectPublicKeyInfo (BEGIN PUBLIC KEY) and private keys as unencrypted PKCS#8 (BEGIN PRIVATE KEY).']
    ]
  },
  'markdown-preview': {
    title: 'Online Markdown Editor & Live Preview - Styled HTML & Publisher Copy | zktool',
    intro: 'Write GitHub-flavored Markdown with instant side-by-side live rendering, customizable typography themes and brand accent colors, Mac-style code blocks, external-link footnotes, distraction-free full-screen mode, and inline-styled HTML copy for rich-text publishers.',
    faqs: [
      ['Why does Copy to publisher inline CSS styles on every element?', 'Many rich-text CMS and newsletter editors strip <style> tags upon paste. Inlining computed styles directly onto HTML elements preserves typography, callouts, and code block formatting.'],
      ['Is raw HTML inside Markdown sanitized?', 'Yes. Rendered output is sanitized locally to strip unsafe script tags and inline event handlers while preserving clean formatting markup.'],
      ['Where are my Markdown drafts saved?', 'Drafts are saved automatically in your current browser localStorage so accidental refreshes never lose your writing, and nothing is uploaded to a server.']
    ]
  },
  'timezone-planner': {
    title: 'Time Zone Meeting Planner - World Clock & Working Hours Overlap | zktool',
    intro: 'Plan international meetings across multiple global cities with a visual 24-hour overlap timeline that highlights business hours (09:00–18:00), shoulder hours, and off-hours while automatically accounting for Daylight Saving Time via the browser Intl API.',
    faqs: [
      ['Does the planner adjust automatically for Daylight Saving Time (DST)?', 'Yes. Offset calculations use the exact meeting date you select against IANA time-zone rules in Intl.DateTimeFormat, so US, UK, EU, and Southern Hemisphere DST shifts are always accurate.'],
      ['How do I find the best meeting slot for US, Europe, and Asia?', 'Add your team cities and scan the 24-hour matrix for columns where every row shows green (working hours) or amber (early/evening edge hours) with zero red overnight slots.'],
      ['Are my selected cities remembered next time?', 'Yes. Your custom city list is stored locally in your browser so your team locations load automatically on future visits.']
    ]
  },
  'date-calculator': {
    title: 'Date Difference Calculator - Business Days & Add/Subtract Dates | zktool',
    intro: 'Calculate the exact number of calendar days, Monday–Friday business days, weeks, and year-month-day intervals between any two dates, or add and subtract days, business days, weeks, months, and years from a base date.',
    faqs: [
      ['How do Include start date and Include end date affect the total?', 'By default, date difference measures elapsed days (end minus start, e.g., Jan 1 to Jan 2 = 1 day). Enabling both checkboxes counts inclusive span days (Jan 1 through Jan 2 = 2 days).'],
      ['Does the business-day count exclude public holidays?', 'Business-day mode excludes Saturdays and Sundays consistently across all regions. Because statutory holidays and make-up workdays vary by country, subtract local holidays manually when needed.'],
      ['How does adding months handle month-end dates like January 31?', 'Calendar arithmetic clamps month-end dates cleanly so adding 1 month to January 31 lands on February 28 (or February 29 in a leap year) rather than overflowing into March.']
    ]
  },
  'docker-compose-converter': {
    title: 'Docker Run to Docker Compose Converter - Online YAML Generator | zktool',
    intro: 'Convert long docker run CLI commands into clean, modern Docker Compose YAML service definitions, mapping published ports (-p), bind mounts and volumes (-v, --mount), environment variables (-e, --env-file), networks, restart policies, capabilities, and health flags locally.',
    faqs: [
      ['Are secrets passed via -e MYSQL_ROOT_PASSWORD=... safe here?', 'Commands are parsed 100% locally in your browser and draft persistence is off by default for privacy. For production Compose files, move inline secrets into a .env file or Docker secrets.'],
      ['Why does --rm show a warning during conversion?', 'docker run --rm deletes a one-off container on exit, which has no direct permanent field in a long-running Compose service; run one-off tasks with docker compose run --rm instead.'],
      ['How should I verify the generated compose.yaml before deploying?', 'Run docker compose config in your project directory to validate schema syntax, variable interpolation, and volume paths against your installed Docker Engine version.']
    ]
  },
  'rmb-uppercase': {
    title: 'Chinese RMB Uppercase Amount Converter - Numeric to Formal Finance | zktool',
    intro: 'Convert numeric Renminbi (CNY/RMB) figures up to 16 integer digits and 2 decimal places into formal Chinese financial uppercase numerals (yuan, jiao, fen, and whole-amount suffixes), or reverse-parse formal uppercase strings back to exact decimal numbers without floating-point rounding errors.',
    faqs: [
      ['Why do mainland Chinese invoices and contracts require formal uppercase numerals?', 'Formal financial characters have intricate stroke patterns designed to prevent forgery and manual alteration on checks, receipts, and contracts—unlike simple everyday numerals which are easy to modify.'],
      ['Why is the converted output still written in Chinese characters on the English page?', 'Formal Chinese financial notation is the exact target format required by mainland Chinese banking and accounting forms. Always verify the converted characters against your numeric figure before filing.'],
      ['How does the converter avoid JavaScript floating-point bugs like 0.1 + 0.2?', 'All parsing and conversion operate directly on validated integer and cent digit strings rather than IEEE-754 floats, guaranteeing exact cent-level accuracy up to trillions.']
    ]
  },
  'chmod-calculator': {
    title: 'chmod Calculator - Linux 755, 644, Octal & rwx Permission Converter | zktool',
    intro: 'Convert Linux and macOS file permissions interactively between owner/group/others rwx checkboxes, 3-digit or 4-digit octal modes (such as 755, 644, 600, 4755), symbolic notation (-rwxr-xr-x), and ready-to-copy chmod CLI commands including setuid, setgid, and sticky bits.',
    faqs: [
      ['What is the difference between chmod 644 and chmod 755?', '644 (rw-r--r--) lets the owner read/write and everyone else read—the standard for regular files. 755 (rwxr-xr-x) adds execute permission, which directories need so users can cd into them and scripts/binaries need to run.'],
      ['Why does SSH refuse private keys unless permissions are chmod 600?', 'OpenSSH rejects ~/.ssh/id_ed25519 or id_rsa if group or others have any read/write access. chmod 600 (rw-------) restricts access strictly to the file owner, and ~/.ssh itself should be 700.'],
      ['What do the 4th leading octal digits (setuid 4, setgid 2, sticky 1) do?', 'Setuid (4000) runs an executable with the file owner UID; setgid (2000) on a shared directory makes new files inherit the directory group; sticky bit (1000, as in 1777 on /tmp) prevents users from deleting files owned by others.']
    ]
  },
  'svg-optimizer': {
    title: 'Online SVG Optimizer & Minifier - Clean SVG & Data URI Converter | zktool',
    intro: 'Minify and clean up SVG vector files locally by stripping XML comments, editor metadata (Inkscape, Sodipodi, Illustrator), empty groups, and excessive coordinate decimals while previewing visual output on checkerboard/light/dark backgrounds and generating CSS-ready Data URIs.',
    faqs: [
      ['Why is URL-encoded SVG Data URI smaller than Base64?', 'SVG is already plain UTF-8 text. Percent-encoding only minimal characters (#, <, >, ") keeps CSS background-image Data URIs ~25% smaller and Gzip-friendlier than Base64 encoding.'],
      ['Can lowering decimal precision distort small icons?', 'On a tiny 24×24 viewBox, rounding to 0 decimals can visibly snap curves; 1 or 2 decimal places usually cuts file size significantly with zero visible difference.'],
      ['Should I remove <title> and <desc> elements?', 'Keep <title> on standalone inline SVGs that convey meaning to screen readers; strip them safely on purely decorative icons marked with aria-hidden="true".']
    ]
  },
  'qr-scanner': {
    title: 'Online QR Code Scanner - Scan from Camera or Image Locally | zktool',
    intro: 'Decode QR codes instantly from your webcam/phone camera or by dropping, selecting, or pasting (Ctrl+V) a screenshot or image file. Powered by client-side BarcodeDetector / jsQR decoding so private Wi-Fi credentials, 2FA setup codes, and internal URLs never leave your browser.',
    faqs: [
      ['Are scanned images or camera frames uploaded to a server?', 'Never. Every video frame and pasted image is decoded locally inside an offscreen browser canvas with zero network traffic.'],
      ['Can I scan a QR code from a screenshot on my desktop?', 'Yes! Press Ctrl+V (or Cmd+V on macOS) anywhere on the page to paste a clipboard screenshot, or drag and drop PNG/JPEG/WebP images directly into the drop zone.'],
      ['Why didn’t Open link trigger automatically after scanning?', 'For your security, decoded URLs are displayed as plain text first so you can inspect the domain and query parameters before choosing whether to open the link.']
    ]
  },
  'exif-viewer': {
    title: 'EXIF Viewer & Metadata Remover - Inspect Photo GPS Online | zktool',
    intro: 'Inspect embedded EXIF, TIFF, and GPS metadata inside JPEG, PNG, WebP, and HEIC photos — including camera model, lens, shutter speed, aperture, ISO, capture timestamp, and exact GPS coordinates — and download a clean metadata-stripped copy 100% locally.',
    faqs: [
      ['Are my personal photos uploaded when checking or removing EXIF?', 'No. Binary EXIF segments are parsed directly from the local File Blob in your browser memory; your photos never leave your device.'],
      ['Why didn’t a photo downloaded from a chat app contain GPS EXIF?', 'Messaging apps and social platforms typically strip EXIF metadata during image compression. Transfer the original file (e.g., via AirDrop, USB, or "Send as File") to inspect original camera tags.'],
      ['How does Remove metadata and download clean the image?', 'It re-exports the clean pixel buffer without EXIF, GPS, XMP, or IPTC APPn markers so you can share photos publicly without leaking your home or office coordinates.']
    ]
  },
  'device-info': {
    title: 'Browser & Screen Device Info - Viewport, DPR, Safe Area & UA | zktool',
    intro: 'Inspect your device screen resolution, CSS viewport dimensions, devicePixelRatio (DPR), notch/home-indicator safe-area insets, User-Agent, CPU concurrency, pointer precision, network status, and Web API support in one live dashboard — click any row to copy.',
    faqs: [
      ['Why is screen.width smaller than my monitor’s physical pixel spec?', 'CSS pixels are scaled by your OS display scaling / Retina factor (devicePixelRatio). Multiply CSS width × devicePixelRatio to estimate the underlying framebuffer resolution.'],
      ['How do I debug iPhone Dynamic Island or home-indicator safe areas?', 'Open this page on the target mobile browser in portrait and landscape modes to read live CSS env(safe-area-inset-top/right/bottom/left) pixel values.'],
      ['Why are hardwareConcurrency or deviceMemory rounded on some browsers?', 'Privacy-hardened browsers cap or bucket hardware metrics to reduce browser-fingerprinting entropy.']
    ]
  },
  'touch-tester': {
    title: 'Multi-Touch & Stylus Event Tester - Screen Touch Points & Pressure | zktool',
    intro: 'Test touchscreen digitizers, trackpads, and Apple Pencil / stylus input directly in your browser. Visualizes simultaneous multi-touch contact points, movement trails, peak touch count, pointer pressure, tiltX/tiltY angles, barrel twist, and live PointerEvent logs.',
    faqs: [
      ['How many simultaneous fingers should a phone or tablet detect?', 'Most modern iOS and Android phones support 5 to 10 simultaneous touch points, while iPads typically track 10+ contacts—note that OS 3-finger or 4-finger system gestures may intercept touches unless disabled.'],
      ['How can I test Apple Pencil or Wacom stylus pressure and tilt?', 'Draw across the test canvas (or enter Full-screen test mode) with your stylus to watch live pressure (0.00–1.00), tiltX/tiltY degrees, and contact area update in real time.'],
      ['Why did multi-touch stop at 2 or 3 points on my mobile browser?', 'Browser pinch-zoom or OS screenshot/multitask gestures can claim multi-finger gestures. Use Full-screen test mode and place fingers slightly apart on the canvas.']
    ]
  },
  'sensor-viewer': {
    title: 'Mobile Sensor Viewer - Live Gyroscope, Accelerometer & Compass | zktool',
    intro: 'Visualize real-time DeviceOrientation and DeviceMotion sensor streams on smartphones and tablets, including 3D phone orientation (alpha, beta, gamma), compass heading, linear acceleration with and without gravity, and gyroscope rotation rates.',
    faqs: [
      ['Why does iOS Safari require clicking Start before showing sensor values?', 'Since iOS 13, WebKit requires an explicit user gesture to call DeviceOrientationEvent.requestPermission() over an HTTPS connection before exposing motion sensors.'],
      ['Why do sensors show unavailable on my desktop computer?', 'Desktops and most laptops lack hardware gyroscopes and accelerometers. Open this page over HTTPS on an iPhone, iPad, or Android phone to inspect live readings.'],
      ['Why does total acceleration read ~9.8 m/s² when the phone lies flat?', 'Earth’s gravitational pull exerts roughly 9.81 m/s² along the vertical Z axis even at rest; compare the Including gravity and Excluding gravity readouts to isolate movement.']
    ]
  },
  'radix-converter': {
    title: 'Number Base Converter - Binary, Octal, Decimal, Hex & Base 2–36 | zktool',
    intro: 'Convert arbitrary-precision integers (powered by BigInt) instantaneously across Binary (Base 2), Octal (Base 8), Decimal (Base 10), Hexadecimal (Base 16), and any custom radix from Base 2 to Base 36, with bit-length, byte-size, and power-of-two inspection.',
    faqs: [
      ['Does this converter lose precision on 64-bit or 128-bit hex values?', 'No. All conversions use native JavaScript BigInt rather than 53-bit IEEE-754 floats, so 64-bit, 128-bit, and 256-bit integers convert with 100% bit-exact accuracy.'],
      ['Are prefixes like 0x, 0b, and 0o accepted in the input fields?', 'Yes. Standard prefixes (0x2a, 0b101010, 0o52) as well as negative signs (-42) are stripped and parsed automatically in their respective fields.'],
      ['What is Base 36 commonly used for?', 'Base 36 uses digits 0–9 plus letters a–z, providing a compact, case-insensitive alphanumeric representation for numeric IDs and short URLs.']
    ]
  },
  'aes-tool': {
    title: 'Online AES-256-GCM Encrypt & Decrypt Tool - Local PBKDF2 | zktool',
    intro: 'Encrypt and decrypt sensitive text notes or configuration snippets in your browser using authenticated AES-256-GCM encryption and PBKDF2-HMAC-SHA256 key derivation with a fresh random 16-byte salt and 12-byte IV on every run — zero server involvement.',
    faqs: [
      ['Why does encrypting the exact same text twice produce different ciphertext?', 'Every encryption generates a fresh cryptographic 16-byte salt and 12-byte IV via crypto.getRandomValues, preventing attackers from detecting identical messages.'],
      ['What does AES-GCM provide over legacy AES-CBC?', 'AES-GCM is an Authenticated Encryption (AEAD) mode: it appends an authentication tag so any wrong password or single-bit tampering is detected immediately upon decryption.'],
      ['Can another tool decrypt the zkaes1:... output?', 'zkaes1: is a self-contained Base64 bundle holding the PBKDF2 iteration parameter, 16B salt, 12B IV, and AES-GCM ciphertext+tag, designed for reliable round-trip decryption on this page.']
    ]
  },
  'cert-decoder': {
    title: 'X.509 Certificate Decoder - Online PEM & SSL/TLS Inspector | zktool',
    intro: 'Decode PEM-encoded X.509 SSL/TLS certificates and multi-certificate chains locally in your browser. Inspect Subject, Issuer, Serial Number, Not Before / Not After validity status, Subject Alternative Names (SANs), public key algorithm, and SHA-256 / SHA-1 fingerprints.',
    faqs: [
      ['Is it safe to inspect internal or production TLS certificates here?', 'Yes—only paste public certificates (-----BEGIN CERTIFICATE-----), which are already public during TLS handshakes. Parsing runs 100% locally in your browser; never paste a private key.'],
      ['Can I paste a full fullchain.pem bundle with intermediate certificates?', 'Yes! Paste an entire PEM chain containing leaf, intermediate, and root certificates, and the decoder will parse and display each certificate in order.'],
      ['Does decoding verify that a certificate is trusted by browsers?', 'Decoding inspects ASN.1 fields and expiration dates locally, whereas full TLS trust requires checking signature chains against root CAs, OCSP/CRL revocation, and hostname matching.']
    ]
  },
  'json-diff': {
    title: 'JSON Diff Tool - Structural JSON Compare Ignoring Key Order | zktool',
    intro: 'Compare two JSON documents structurally by object path rather than raw line positions—listing added, removed, modified, and type-changed fields clearly even when object keys are formatted or ordered differently, with an optional order-insensitive array mode.',
    faqs: [
      ['How is JSON Diff better than a plain text diff for API responses?', 'A plain text diff flags every reordered key or indentation change as noise. Structural JSON Diff parses both payloads first and reports only real semantic changes by JSON path (e.g., $.user.roles[1]).'],
      ['When should I enable Ignore array order?', 'Enable it when comparing arrays that behave like sets (such as permission lists or tag arrays) where ["read","write"] and ["write","read"] are semantically equivalent.'],
      ['Is my JSON data sent to any backend API?', 'Never. Both JSON documents are parsed and diffed exclusively inside your local browser tab.']
    ]
  },
  'cidr-calculator': {
    title: 'IPv4 CIDR Subnet Calculator - Netmask, Host Range & Subnet Split | zktool',
    intro: 'Calculate IPv4 network address, broadcast address, subnet mask, wildcard mask, usable host range, and address class from any CIDR block (such as 192.168.1.0/24 or 10.0.0.0/16), test whether an IP belongs to the subnet, and split networks into smaller prefixes.',
    faqs: [
      ['Why does a /24 network have 254 usable hosts instead of 256?', 'A /24 block spans 256 IPv4 addresses (2^8), but the first address (all host bits 0) is the network identifier and the last address (all host bits 1) is the directed broadcast address.'],
      ['How are /31 and /32 prefixes handled?', 'Per RFC 3021, a /31 point-to-point router link uses both addresses with no broadcast waste (2 usable hosts), while /32 represents a single host route (1 address).'],
      ['Which IPv4 ranges are reserved for private networks (RFC 1918)?', '10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255), and 192.168.0.0/16 are private LAN/VPC blocks that are not routable on the public internet.']
    ]
  },
  'css-length-unit': {
    title: 'CSS Length Unit Explorer - Interactive px, rem, em, vw & vh Guide | zktool',
    intro: 'Compare absolute (px, pt, pc, cm, mm, in) and relative (em, rem, vw, vh, vmin, vmax, ch, rlh) CSS length units side by side in a live interactive sandbox. Adjust base font size and container width sliders to visualize how responsive CSS units scale.',
    faqs: [
      ['When should I use rem instead of em or px in CSS?', 'Use rem for typography and spacing tokens so everything scales predictably with the user’s root browser font-size preference, avoiding the compounding multiplication of nested em units.'],
      ['Does 1px in CSS always equal one physical hardware pixel?', 'No. On Retina and high-DPI screens (where devicePixelRatio is 2 or 3), 1 CSS px maps to a 2×2 or 3×3 grid of physical device pixels so layouts remain readable.'],
      ['What is the advantage of ch and rlh units?', '1ch approximates the width of the "0" glyph (ideal for readable prose max-width: 65ch), while 1rlh matches the root line-height for consistent vertical rhythm.']
    ]
  },
  'drag-and-drop-playground': {
    title: 'HTML5 Drag and Drop Playground - Live DnD API & File Drop Tester | zktool',
    intro: 'Explore and debug the native HTML5 Drag and Drop API through three interactive demos—container-to-container dragging, live sortable list reordering, and drag-and-drop local file inspection—paired with a real-time DragEvent stream logger.',
    faqs: [
      ['Why won’t an element accept drops unless dragover calls preventDefault()?', 'By default, browsers reject drops on most DOM elements. Calling event.preventDefault() inside both dragenter and dragover signals that the element is a valid drop target.'],
      ['Are files dropped into Example 3 uploaded anywhere?', 'No. Dropped files are inspected locally via event.dataTransfer.files to display file names, MIME types, and byte sizes without any network upload.'],
      ['Does native HTML5 Drag and Drop work identically on mobile touchscreens?', 'Mobile support for HTML5 DragEvents varies across browsers; production sortable UIs often pair DragEvents with PointerEvents and keyboard reordering buttons for full accessibility.']
    ]
  },
  'id-card-checker': {
    title: 'Chinese ID Checksum Calculator - GB 11643-1999 Modulo-11 Verifier | zktool',
    intro: 'Calculate or verify the 18th checksum character (0–9 or X) of a mainland Chinese 18-character resident identity number locally in your browser using the official GB 11643-1999 weighted modulo-11 formula, with zero draft storage or network transmission.',
    faqs: [
      ['How is the 18th check character calculated under GB 11643-1999?', 'Each of the first 17 digits is multiplied by its positional weight [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], summed modulo 11, and mapped through [1, 0, X, 9, 8, 7, 6, 5, 4, 3, 2].'],
      ['Why can a valid ID number end with the letter X?', 'When the weighted sum modulo 11 equals 2, the check value is 10—written as Roman numeral X so the identifier remains fixed at exactly 18 characters.'],
      ['Does passing the checksum prove an ID number is real?', 'No. Modulo-11 only catches single-digit typos and adjacent transpositions during form validation; it cannot verify official issuance or identity ownership.']
    ]
  },
  'us-address-generator': {
    title: 'US Address Generator - Tax-Free States, Real ZIP Codes & Phone | zktool',
    intro: 'Generate realistic US commercial street addresses across all 50 states, Washington D.C., and the 5 sales-tax-free states (Oregon, Delaware, Montana, New Hampshire, Alaska) locally in your browser. Every record pairs a real commercial corridor street address with its matching city, county, state code, 5-digit ZIP / ZIP+4, IANA time zone, and area-code phone number, with one-click copy and JSON/CSV batch export.',
    faqs: [
      ['Which US states have 0% state sales tax?', 'Five US states charge no state-level sales tax (often remembered as NOMAD): New Hampshire (NH), Oregon (OR), Montana (MT), Alaska (AK — specifically Anchorage and Fairbanks, which also have 0% local sales tax), and Delaware (DE).'],
      ['Why are Address Line 1 and Address Line 2 separated?', 'US checkout forms and USPS / Google Places address validators verify the primary building number and street name on Address Line 1, while optional office suite numbers (Suite / Ste) belong on Address Line 2.'],
      ['What is the difference between Standard phone format and 555-01XX?', 'Standard mode pairs the city’s real geographic area code (NPA) with a valid NANP exchange format accepted by libphonenumber validators, while 555-01XX uses the official North American fictional test range guaranteed never to reach a real subscriber.']
    ]
  }
};
