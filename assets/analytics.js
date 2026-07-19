/* 百度统计：仅在正式域名上报，本地/预览环境不注入，避免污染数据 */
var _hmt = _hmt || [];
(function () {
    if (!/(^|\.)zktww\.cn$/.test(location.hostname)) return;
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?765151677bc00771693a6e556e65cd1f";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
