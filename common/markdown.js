/**
 * Created by hama on 2017/6/1.
 */
const MarkdownIt = require('markdown-it');
const _          = require('lodash');
const validator  = require('validator');
const jsxss      = require('xss');
// 设置默认选项
var md = new MarkdownIt();

md.set({
    html:         false,        // 在源代码中启用HTML标记
    xhtmlOut:     false,        // 使用“/”关闭单个标签(br//)
    breaks:       false,        // 将“n”转换成段落
    linkify:      true,        // 自动转换url的文本到链接
    typographer:  true,        // 启用智能类型和其他的甜蜜转换
});

md.renderer.rules.fence = function (tokens, idx) {
    var token    = tokens[idx];
    var language = token.info && ('language-' + token.info) || '';
    language     = validator.escape(language);

    return '<pre class="prettyprint ' + language + '">'
        + '<code>' + validator.escape(token.content) + '</code>'
        + '</pre>';
};

md.renderer.rules.code_block = function (tokens, idx /*, options*/) {
    var token    = tokens[idx];
    return '<pre class="prettyprint">'
        + '<code>' + validator.escape(token.content) + '</code>'
        + '</pre>';
};
var myxss = new jsxss.FilterXSS({
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        // 让 prettyprint 可以工作
        if (tag === 'pre' && name === 'class') {
            return name + '="' + jsxss.escapeAttrValue(value) + '"';
        }
    }
});
exports.markdown = function (text) {
    return '<div class="markdown-text">' + myxss.process(md.render(text || '')) + '</div>';
};