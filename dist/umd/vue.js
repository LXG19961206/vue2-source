(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 拿到数组上原型上的方法
  var oldArrayProtoMethods = Array.prototype; //

  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'reserve', 'unshift', 'sort', 'splice', 'shift'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 当我们调用数组我们劫持的这 7 个方法，页面应该更新
      var result = oldArrayProtoMethods[method].apply(this, args);
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      if (inserted) {
        this.__ob__.observeArray(this);
      }

      this.__ob__.dep.notify(); // 通知数组更新


      return result;
    };
  });

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.subs = [];
      this.id = id$1++;
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 我们希望 watcher 也可以存放 dep, 让 dep 和 water 双向记忆
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }();
  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher); // 渲染 watcher , 还有其他的watcher
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  } // 多对多的关系， 一个属性有一个 dep 是用来收集 watcher 的
  // dep 可以存放多个 watcher vm.$watch('name')
  // 一个 watcher 可以对应多个 dep

  function mergeHook(parentVal, childValue) {
    // 生命周期的合并
    if (childValue) {
      if (parentVal) {
        return parentVal.concat(childValue);
      } else {
        return [childValue];
      }
    } else {
      return parentVal;
    }
  }

  var callbacks = [];
  var timerFunc = undefined,
      pending$1 = false;

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    // 可以监控 dom 的变化，监控完毕后会异步更新
    var observe$1 = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observe$1.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (window.setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  }

  function nextTick(cb) {
    callbacks.push(cb); // Vue 3 的 nextTick 原理就是 promise.then

    !pending$1 && timerFunc();
  }

  function flushCallbacks() {
    while (callbacks.length) {
      // 让 nextTick 中传入的方法一次执行
      callbacks.pop()();
    }

    pending$1 = false; // 并且标识已经执行完毕
  }

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destoryed'];
  var strats = {};

  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal); // res.__proto__ = parentVal

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  };

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略，但是有些属性需要有特殊的合并方式  比如需要对生命周期进行一个特殊的拦截


    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] === null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }
  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  console.log(Dep, 2323);
  function observe(data) {
    if (data.__ob__) return data;

    if (data && _typeof(data) === 'object') {
      // data必须是一个对象
      return new Observer(data);
    }
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // 使用 defineProperty 来重新定义属性

      if (Array.isArray(value)) {
        // 函数劫持, 重写数组的方法,再调用原方法的同时,又去做了一些响应式处理的逻辑
        value.__proto__ = arrayMethods; // 观测数组的对象类型,对象变化也做一些事情

        this.observeArray(value); // 判断一个对象是否被观测过

        defineProperty(value, '__ob__', this);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // 获取对象的key

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 为了实现了深层对象的处理, 首先递归地执行 observe 进行判断,如果还是一个对象类型的话
    // 这样会导致性能比较差
    // 获取到数组对应的 dep
    var childDep = observe(value); // 每个属性都有一个 dep 属性，用于存放 watcher
    // 当页面取值时候，说明这个值用来渲染了，此时将这个 属性和 watcher 对应起来

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          // 让这个属性记住这个 watcher
          dep.depend();

          if (_typeof(childDep) === 'object') {
            childDep.dep.depend(); // 数组存起来这个渲染过程
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return; // 如果用户传进来的依旧是个对象的话,对这个对象依旧使用 observe 方法

        observe(newValue);
        value = newValue;
        dep.notify();
      }
    });
  } // 但是要对数组进行特殊的操作
  // 确实使用 defineProperty确实可以对数组进行拦截,但是如果是个巨大的数组, 会导致性能很差
  // 于是 Vue 直接重写了数组的常用方法, 在你调用这些方法时候,添加了一些实现了响应式的逻辑
  // -- push , pop ,shift , unshift , splice , sort ,reserve

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.callback = callback;
      this.options = options; // 如果watcher上有 lazy 属性, 说明是一个计算属性
      // dirty 代表取值时候是否执行用户提供的方法

      this.lazy = options && options.lazy;
      this.dirty = this.lazy;
      this.user = options ? options.user : null; // 这是一个用户 watcher

      this.id = id++; // 是 watcher 的唯一标识

      this.deps = []; // 记住 watcher 有多少 dep 关注它

      this.depsId = new Set();

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        this.getter = function () {
          // exprOrFn 可能传递额是一个字符串
          // 当去当前实例上进行取值的时候，才会去进行依赖收集
          var path = exprOrFn.split('.');
          var obj = vm;

          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      } // 默认会进行一次 get 方法， 进行取值 ， 将结果保留起来


      this.value = this.lazy ? void 0 : this.get(); // 默认会调用 get 方法
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "get",
      value: function get() {
        // 当我们渲染时候会调用这个方法
        // -- 渲染之前将 watcher 放在全局上
        // -- 因为之前为值 设置了 Object.defineProperty
        // -- 取值的时候会触发 getter
        // -- 这个时候让 dep 记住当前的 watcher
        // -- 让用户赋值的时候会触发 set
        // -- 等会属性更新了，就重新调用渲染逻辑 ；触发 set 时候，遍历 dep 中的 watcher 来执行
        pushTarget(this); // 当前 watcher 实例

        var result = this.getter.call(this.vm); // 调用 exprOrFn，渲染页面

        popTarget();
        return result;
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newValue = this.get();
        this.value = newValue;

        if (this.user) {
          this.callback.call(this.vm, newValue, oldValue);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        // 计算属性 watcher 会存储 dep
        // 通过 watcher 找到对应的 所有的 dep ,再让 dep 都记住这个 watcher
        var i = this.deps.length;

        while (i--) {
          // 让 dep 去存储渲染 watcher
          this.deps[i].depend();
        }
      }
    }, {
      key: "update",
      value: function update() {
        // 这个里面不要每次调用 get 方法， get 方法会重新绘制页面
        // 暂存的概念
        if (this.lazy) {
          this.dirty = true; // 页面重新渲染就可以获取最新值
        } else {
          queueWatcher(this);
        }
      }
    }]);

    return Watcher;
  }();
  var queue = [],
      has = {},
      pending = false; // 将需要批量更新的 watcher 放在一个队列中，稍后让 watcher 执行

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      window.queue = queue;
      has[id] = true;

      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  } // 刷新当前队列


  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      watcher.run();
      !watcher.user && watcher.callback();
    });
    queue = [];
    has = {};
    pending = false;
  }

  function initState(vm) {
    // vm.$options
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    observe(data); // 数据的劫持方案 对象 Object.defineProperty 方法
    // 数组会单独处理
    // 当我去 vm 上取值时候,帮我把值代理到 vm._data上

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initComputed(vm) {
    var computed = vm.$options.computed; // -> 需要有一个 watcher

    var watchers = vm._computedWatchers = {}; // -> 需要有一个 defineProperty

    for (var key in computed) {
      var userDef = computed[key]; // -> 获取 getter 方法
      //    -> 因为 computed 既可以传一个函数，又可以传一个对象

      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, function () {});
      defineComputed(vm, key, userDef);
    } // -> 需要一个 dirty

  }

  function defineComputed(target, key, userDef) {
    var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      set: function set() {},
      get: function get() {}
    };

    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key);
    } else {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = userDef.set;
    }

    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function () {
      // 此方法是我们包装的方法,每次取值会调用此方法,此方法会判断到底需不需要执行用户传递的方法
      var watcher = this._computedWatchers[key]; // 拿到这个属性对应的 watcher , 因为这个方法最终会被其实例执行,所以 this 其实就是 vm

      if (watcher) {
        if (watcher.dirty) {
          // 默认是脏的
          watcher.evaluate(); // 对当前方法进行求值
        }

        if (Dep.target) {
          watcher.depend();
        }

        debugger;
        return watcher.value; // 会默认返回 上一次的值
      }
    };
  }

  function createWatcher(vm, exprOrFn, handler, options) {
    // options 可以用来标识是用户 watcher
    if (_typeof(handler) === 'object') {
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    return vm.$watch(exprOrFn, handler, options);
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;

    var _loop = function _loop(key) {
      var handle = watch[key];

      if (Array.isArray(handle)) {
        handle.forEach(function (handle) {
          return createWatcher(vm, key, handle);
        });
      } else {
        createWatcher(vm, key, handle);
      }
    };

    for (var key in watch) {
      _loop(key);
    }
  }

  function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
      nextTick(cb);
    };

    Vue.prototype.$watch = function (exprOrFn, cb, options) {
      console.log(exprOrFn, cb, options); // 数据变化后，应该让 watcher 重新执行

      new Watcher(this, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));

      if (options && options.immediate) {
        cb();
      }
    };
  }

  function parseHTML(html) {
    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 用于匹配命名空间

    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 开头标签

    var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 结束标签

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 属性匹配

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var startTagClose = /^\s*(\/?)>/; // 匹配 {{  }}

    var root;
    var currentParent;
    var stack = [];

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 当前解析的标签 保存起来

      stack.push(element);
    }

    function end(tagName) {
      // 在结尾标签处,创建父子关系
      var element = stack.pop(); // 取出栈中的最后一个

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        // 在闭合时候可以知道这个标签的父亲是谁
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.trim();

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    while (html) {
      // 只要 html 不为空字符串,就一直解析下去
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 肯定是标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // 是文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //删除开始标签
        // 如果直接是 闭合标签了,说明没有属性

        var _end, attr; // 不是结尾标签,也能匹配到属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function generate(ast) {
    // 语法层面的转译
    var children = getChildren(ast);
    return "_c('".concat(ast.tag, "',").concat(ast.attrs.length ? '{' + genProps(ast.attrs) + '}' : 'undefined', ",").concat(children ? children : '', ")");
  }

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = JSON.stringify(obj);
        })();
      }

      str += "".concat(attr.name, ":'").concat(attr.value, "',");
    }

    return str.slice(0, -1).toString();
  } // 将所有转换后的 儿子 用逗号拼接起来


  function gen(node) {
    if (node.type === 1) {
      // 生成元素节点的字符串
      return generate(node);
    } else {
      var text = node.text; // 如果是普通文本

      if (!defaultTagRE.test(text)) {
        // 如果是带有变量 {{  }} 的文本
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var tokens = []; // 如果正则是全局模式,需要每次使用前置为0,否则可能会匹配不到

      var lastIndex = defaultTagRE.lastIndex = 0;
      var match, index; //每次匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1] ? match[1].trim() : '', ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function getChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (child) {
        return gen(child) + ',';
      }).join('').slice(0, -1);
    }
  }

  function compileToFunctions(template) {
    // 将 html 模版 - render 函数
    // 1.需要将 html转换为 ”ast语法树“, 可以用 ast树 来描述语言
    // - ast 本身是用于描述代码的
    // 虚拟 DOM 是用对象来描述节点
    // 2.通过这棵树,重新地生成代码
    var ast = parseHTML(template); // 优化静态节点
    // 通过这棵树, 生成一个render 函数

    var code = generate(ast); // 通过 with 关键词 限制取值范围
    // 稍后调用 render 可以通过 with 改变内部结果

    return new Function("with(this){return ".concat(code, "}"));
  }

  function patch(oldVnode, vnode) {
    // 默认初始化时候，使用虚拟节点创建出真实节点，替换掉老节点
    // 如果oldVnode 是一个真实 dom
    if (oldVnode.nodeType === 1) {
      // 代表是一个真实节点
      // 将虚拟节点转换为真实节点
      console.log(oldVnode, vnode); // 产生真实 dom

      var el = createElm(vnode); // 获取老的 app 的父亲元素

      var parentELm = oldVnode.parentNode; // 将真实元素插入到 app 的后面

      parentELm.insertBefore(el, oldVnode.nextSibling);
      parentELm.removeChild(oldVnode);
      return el;
    } else {
      // 在更新时候，使用老的虚拟节点 和新的虚拟节点做对比， 将不同的地方更新到真实 dom 上
      // 既有渲染功能又有更新功能
      // 用新的虚拟节点 对比 老的虚拟节点， 找到差异， 去最少程度地更新dom
      // diff的核心是同级比较
      // 1. 比较两个元素的标签，如果标签不同，直接替换掉即可
      if (oldVnode.tag !== vnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      } // 2.有种可能是标签一样, 文本节点的虚拟节点 tag 都是 undefined


      if (!oldVnode.tag) {
        // 文本的对比
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text;
        }
      } // 3.标签一样，需要对比 标签的 属性 和 children


      var _el = vnode.el = oldVnode.el; // 复用节点
      // 更新属性，用新的虚拟节点的属性和老的比较去更新即可


      updateProperties(vnode, oldVnode.data); // 比较儿子

      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || []; // -> 老的有儿子，新的也有儿子 diff 算法

      if (oldChildren.length && newChildren.length) {
        updateChild(oldChildren, newChildren, oldVnode.el);
      } else if (oldChildren.length) {
        // -> 老的有儿子，新的没儿子
        _el.innerHTML = '';
      } else if (newChildren.length) {
        // -> 老的没儿子，新的有儿子
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];

          _el.appendChild(createElm(child));
        }
      }
    }
  } // 判断两者是否是相同的节点

  function isSameVnode(oldVnode, newVnode) {
    // 只要标签以及 key 值相同，两者就是同一个元素
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  } // 儿子间的比较


  function updateChild(oldChildren, newChildren, parent) {
    var oldStartIndex = 0,
        oldStartVnode = oldChildren[0],
        oldEndIndex = oldChildren.length - 1,
        oldEndVnode = oldChildren[oldChildren.length - 1];
    var newStartIndex = 0,
        newStartVnode = newChildren[0],
        newEndIndex = newChildren.length - 1,
        newEndVnode = newChildren[newChildren.length - 1]; // vue 的中的 diff 算法做了很多的 优化
    // DOM 中的操作有很多常见的逻辑 ： 把节点插入到当前儿子的 头、尾
    // vue2 中采用了双指针的方式
    // 在尾部添加
    // 创建一个循环，同时循环 老的和新的，哪个先循环完就退出循环，将多余的添加或者删除
    // 比较谁先循环完

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        item.key && (map[item.key] = index);
      });
    }

    var map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartVnode];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex]; // oldStartVnode newStartVnode 如果是两者是同一个节点，那么比较他们的 children
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 如果两者是同一个元素，对比
        patch(oldStartVnode, newStartVnode); // 更新属性和 再去递归更新子节点
        // diff 完成后， 移动指针

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex]; // 如果老的头和新的尾是同一个
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 反转了节点
        // -> 头部移动到了尾部
        // -> 尾部移动到了头部
        patch(oldStartVnode, newEndVnode); // 将当前元素放到 尾部下一个元素的前面去

        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        // 反转了节点
        // -> 头部移动到了尾部
        // -> 尾部移动到了头部
        patch(oldEndVnode, newStartVnode); // 将当前元素放到 尾部下一个元素的前面去

        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 儿子之间没有直接的关系， 进行暴力对比
        var moveIndex = map[newStartVnode.key]; // 拿到开头的虚拟节点，去老的节点中找，看看有没有

        if (moveIndex == undefined) {
          // 说明新元素不再老节点中
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVNode = oldChildren; // 这个老的虚拟节点需要移动

          oldChildren[moveIndex] = null;
          parent.insertBefore(moveVNode.el, oldStartVnode.el);
          patch(moveVNode.el, newStartVnode); // 比较属性和儿子
        }

        newStartVnode = newChildren[++newStartIndex]; // 用新的不停地去老的里面找
      }
    }

    if (newStartIndex <= newEndIndex) {
      // 此时开始和结束指针重合
      // 将新的多余的部分插入即可
      // 但是有可能是向前添加，也有可能是向后添加
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), ele);
      }
    } // 如果老节点多，删去多余内容


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != undefined) {
          parent.removeChild(child.el);
        }
      }
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        vnode.data;
        var text = vnode.text;

    if (typeof tag == 'string') {
      // 创建元素放在 vnode.el 上面
      vnode.el = document.createElement(tag); // 遍历儿子，将渲染后的结果放在父节点上

      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  // - 初始化数据
  // - 将模版编译为 render 函数
  // - 生成虚拟节点
  // - 根据虚拟节点 生成新的 DOM
  // - 扔到 真实 DOM 上


  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var el = vnode.el;
    var newProps = vnode.data || {}; // 老的有新的没有，需要删除属性

    for (var key in oldProps) {
      if (!newProps[key]) {
        // 移除真实 dom 的属性
        el.removeAttribute(key);
      }
    }

    try {
      var newStyle = JSON.parse(newProps['style']) || {};
      var oldStyle = JSON.parse(oldProps['style']) || {}; // 老的有，新的没有，直接删除老的即可

      for (var _key in oldStyle) {
        if (!newStyle[_key]) {
          el.style[_key] = '';
        }
      } // 新的有， 直接用新的去做更新即可

    } catch (err) {}

    for (var _key2 in newProps) {
      switch (_key2) {
        case 'style':
          var styleObject = JSON.parse(newProps[_key2]);

          for (var css in styleObject) {
            el.style[css] = styleObject[css];
          }

          break;

        case 'class':
          el.className = newProps["class"];
          break;

        default:
          el.setAttribute(_key2, newProps[_key2]);
          break;
      }
    }
  }

  function lifeCycleMinix(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var prevVnode = vm._vnode; // 用新的创建的元素，替换调原来的 vm.$el

      if (!prevVnode) {
        // 首次渲染的逻辑
        vm.$el = patch(vm.$el, vnode);
      } else {
        // 后续渲染的逻辑
        vm.$el = patch(prevVnode, vnode);
      }

      vm._vnode = vnode;
    };
  }
  function mountComponent(vm, el) {
    // 调用 render 方法,生成真实 dom  去渲染 el 属性
    // 先调用 render 方法,创建一个虚拟节点,再将虚拟节点渲染到页面上
    // 这个方法是 vue 的核心内容
    callHook(vm, 'beforeMount');

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // watcher 用于渲染的，目前没有任何功能


    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'updated');
    }, true);
    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      // 需要处理好生命周期中的 this，所以使用了 call
      handlers.forEach(function (fn) {
        return fn.call(vm);
      });
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 将用户传递的和全局的内容进行合并

      vm.$options = mergeOptions(vm.constructor.options, options); // 初始化状态(将数据做一个初始化的劫持,当数据改变时候更新视图)
      // vue组件中有很多状态 data,props,watch,computed

      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created'); // vue里面核心特新 响应式数据原理
      // vue 是什么样子的框架 借鉴了 MVVM
      // 数据变化视图会更新, 视图变化视图会被影响
      // 但是 MVVM 不能跳过数据去更新视图,但是 Vue 可以通过 refs 直接修改视图内容

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      vm.$el = el;
      var opt = vm.$options;

      if (!opt.render) {
        // 如果没有 render 方法
        // 将 template 转化为 render 方法
        if (!opt.template && el) {
          opt.template = el.outerHTML;
        } // 将 模版 编译为 render 函数


        opt.render = compileToFunctions(opt.template);
      } // 渲染时候用的都是 这个 render 方法


      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._s = function (val) {
      // stringify
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._v = function (text) {
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      return render.call(vm);
    };
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  }
  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 用于产生虚拟 dom

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function initExtend(Vue) {
    // 核心就是创建一个子类继承我们的父类
    Vue.extend = function (params) {
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      }; // 子类继承父类原型上的方法


      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, this.options);
      return Sub;
    };
  } // 组件的渲染流程
  // -> 调用Vue.component
  // -> 内部使用了 Vue.extend , 就是产生一个子类来继承父类
  // -> 创建子类实例时候会调用父类的 _init 方法,再去 $mount 即可
  // -> 组件的初始化其实就是 new 了这个组件 并且调用了上面的 $mount 方法
  // -> 组件的合并策略 , 采用的是就近策略, 我们可以将全局组件放到原型链上, 这样当自己没有的时候才去找全局的

  function initGlobalApi(Vue) {
    // 整个了 所有的全局相关的内容
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };

    Vue.options.components = {};
    Vue.options._base = Vue; // 指的就是 vue 的构造函数

    initExtend(Vue);

    Vue.component = function (id, definition) {
      definition.name = definition.name || id; // 根据当前组件对象生成了子类的构造函数
      // 用的时候,得 new 一个 definition().$mount

      definition = this.options._base.extend(definition); // 永远是父类

      Vue.options.components[id] = definition;
    }; // 生命周期的合并策略,把同名的生命周期维护到一个数组里

  }

  // options Api 通过一个选项进行配置

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // init 方法

  lifeCycleMinix(Vue); // _update

  renderMixin(Vue); // _render
  // 初始化全局的 api

  initGlobalApi(Vue);
  stateMixin(Vue);

  return Vue;

})));
