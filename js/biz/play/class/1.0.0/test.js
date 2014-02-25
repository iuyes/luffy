//class的继承调用
define(function(require,exports,module){
    var Flyredpig=require('play/class/1.0.0/flyredpig');
    require('./flyswimredpig');  //动态添加类的功能文件
    var flyredpig=new Flyredpig('红猪侠');
    flyredpig.echoname();
    alert(flyredpig.color);
    flyredpig.flyable();
    flyredpig.swim();
});