define(function (require, exports, module) {
    var Events = require('arale/events/1.1.0/events');

    function Dog() {
    }

    function Cat() {
    }

    //将event类混入到Dog类中
    Events.mixTo(Dog);
    Dog.prototype.sleep = function () {
        this.trigger('sleep');
    }

    var dog = new Dog();
    //注册事件
    dog.on('sleep', function () {
        alert('小狗在睡觉');
    });
    //调用sleep函数促发sleep事件
    dog.sleep();

    //将event类混入到Cat类中
    Events.mixTo(Cat);
    var cat = new Cat();
    //代理任何事件用dog实例促发
    cat.on('all', function (eventName) {
        dog.trigger(eventName);
    });
    //促发sleep事件
    cat.trigger('sleep');

});