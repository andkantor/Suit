Suit = (function (window, undefined) {
    var index, key, dependencies, dep, func, parts, data,
        document = window.document;

    var Core = {
        up: function (element, suits) {
            suits = suits || element.getAttribute('suit').split(';');

            Core.initProp(element, element, window.Suit.propName);

            if (!Container.has(element)) {
                Container.add(element);
            }

            Tool.each(suits, function (i, suitClass) {
                data = Core.parseSuit(element, suitClass);

                if (element.__Suits__.indexOf(data.classString) > -1) {
                    return;
                }

                suitClass = Core.classify(data.classString);

                if (suitClass !== undefined) {
                    element.__Suits__.push(data.classString);
                    Core.copy(Core.build(suitClass), data.to);
                }
            });
        },
        initProp: function (element, prototype, prop) {
            if (!element.hasOwnProperty(prop)) {
                func = function () {};
                func.prototype = prototype;
                element[prop] = new func();
            }
        },
        parseSuit: function (element, suitClass) {
            if (suitClass.indexOf('=') > -1) {
                parts = suitClass.split('=');
                Core.initProp(element[window.Suit.propName], element, parts[0]);

                return {
                    to: element[window.Suit.propName][parts[0]],
                    classString: parts[1]
                }
            } else {
                return {
                    to: element[window.Suit.propName],
                    classString: suitClass
                }
            }
        },
        refresh: function () {
            Tool.each(document.querySelectorAll('[suit]'), function (i, element) {
                Core.up(element);
            });
        },
        classify: function (classString, namespace) {
            namespace = namespace || window;

            if ((index = classString.indexOf('.')) === -1) {
                return namespace[classString];
            }

            return this.classify(
                classString.substring(index + 1, classString.length),
                namespace[classString.substring(0, index)]
            );
        },
        copy: function(from, to) {
            for (key in from) {
                if (key !== window.Suit.propName && from[key] != null) {
                    to[key] = from[key];
                }
            }
        },
        build: function (suitClass) {
            dependencies = [];

            if (suitClass.hasOwnProperty('dependencies')) {
                Tool.each(suitClass.dependencies, function (i, dependency) {
                    dependencies.push(DI.lookUp(dependency));
                });
            }

            return this.create(suitClass, dependencies);
        },
        create: function (suitClass, dependencies) {
            func = function () { suitClass.apply(this, dependencies); };
            func.prototype = suitClass.prototype;
            return new func();
        }
    };

    // Dependency Injection
    var DI = {
        services: {},
        params: {},
        get: function (id) {
            return this.services[id];
        },
        set: function (id, service) {
            this.services[id] = service;
        },
        getParam: function (name) {
            return this.params[name];
        },
        setParam: function (name, value) {
            this.params[name] = value;
        },
        lookUp: function (dependency) {
            if (typeof dependency === 'string') {
                if (dep = this.toGlobal(dependency)) {
                    return Core.classify(dep);
                } else if (dep = this.toService(dependency)) {
                    return this.get(dep);
                } else if (dep = this.toParam(dependency)) {
                    return this.getParam(dep);
                }
            }

            return dependency;
        },
        toGlobal: function (str) {
            return str.indexOf('{') === 0 && str.indexOf('}') === str.length - 1
                ? str.substring(1, str.length - 1)
                : '';
        },
        toService: function (str) {
            return str.indexOf('@') === 0
                ? str.substring(1, str.length)
                : '';
        },
        toParam: function (str) {
            return str.charAt(0) === '%' && str.charAt(str.length - 1) === '%'
                ? str.substring(1, str.length - 1)
                : '';
        }
    };
    
    // Elements Container
    var Container = {
        elements: {},
        counter: 0,
        add: function (element) {
            element.__SuitID__ = element.__SuitID__ || ++this.counter;
            this.elements[element.__SuitID__] = element;
            element.__Suits__ = [];
        },
        has: function (element) {
            return element.hasOwnProperty('__SuitID__')
                ? this.elements.hasOwnProperty(element.__SuitID__)
                : false;
        }
    };
    
    //Tools
    var Tool = {
        bind: function (obj, event, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(event, fn, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + event, function ()
                {
                    fn.apply(obj, new Array(window.event));
                });
            } else {
                obj["on" + event] = fn;
            }
        },
        each: function (elements, callback) {
            for (key in elements) {
                if (elements.hasOwnProperty(key) && key !== 'length') {
                    callback(key, elements[key]);
                }
            }
        }
    };

    Tool.bind(document, 'DOMContentLoaded', function () {
        Core.refresh();
    });

    return {
        propName: 'St',
        up: function (element, suits) {
            Core.up(element, suits);
        },
        refresh: function () {
            Core.refresh();
        },
        DI: {
            get: function (id) {
                return DI.get(id);
            },
            set: function (id, service) {
                DI.set(id, service);
            },
            getParam: function (name) {
                return DI.getParam(name);
            },
            setParam: function (name, value) {
                DI.setParam(name, value);
            }
        }
    };
})(window);