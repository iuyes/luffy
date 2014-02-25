//aspect
define(function (require, exports, module) {
    var Base = require('arale/base/1.1.1/base');
    var Dialog= Base.extend({
          show:function(a,b){
              console.log(a+b);
              return (a+b);
          }
    });
    module.exports=Dialog;
});