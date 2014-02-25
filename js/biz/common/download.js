/**
 * Created by huijun on 13-11-17.
 */
define(function (require, exports, module) {
    DownloadFile = function (a) {
        if (DownloadFile.isChrome || DownloadFile.isSafari) {
            var b = document.createElement("a");
            b.href = a;
            if (b.download !== undefined) {
                var c = a.substring(a.lastIndexOf("/") + 1, a.length);
                b.download = c
            }
            if (document.createEvent) {
                var d = document.createEvent("MouseEvents");
                return d.initEvent("click", !0, !0), b.dispatchEvent(d), !0
            }
        }
        var e = "?download";
        open(a + e, '_self')
    };
    DownloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1, DownloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf("safari") > -1
    module.exports = DownloadFile;
});
