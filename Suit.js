(function (window) {
    var index, key, dependencies, dep, func,
        document = window.document;

    window.Suit = {
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
        },
        up: function (element, suits) {
            this.each(suits.split(';'), function (i, suitClass) {
                suitClass = Suit.classify(suitClass);

                if (suitClass !== undefined) {
                    Suit.copy(Suit.build(suitClass), element);
                }
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
                if (from[key] != null) {
                    to[key] = from[key];
                }
            }
        },
        build: function (suitClass) {
            dependencies = [];

            if (suitClass.hasOwnProperty('dependencies')) {
                this.each(suitClass.dependencies, function (i, dependency) {
                    dependencies.push(Suit.DI.lookUp(dependency));
                });
            }

            return this.create(suitClass, dependencies);
        },
        create: function (suitClass, dependencies) {
            func = function () { suitClass.apply(this, dependencies); };
            func.prototype = suitClass.prototype;
            return new func();
        },
        DI: {
            services: {},
            get: function (id) {
                return this.services[id];
            },
            set: function (id, service) {
                this.services[id] = service;
            },
            lookUp: function (dependency) {
                if (typeof dependency === 'string') {
                    if (dep = this.toGlobal(dependency)) {
                        return Suit.classify(dep);
                    } else if (dep = this.toService(dependency)) {
                        return this.get(dep);
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
            }
        }
    };

    Suit.bind(document, 'DOMContentLoaded', function () {
        Suit.each(document.querySelectorAll('[suit]'), function (i, element) {
            Suit.up(element, element.getAttribute('suit'));
        });
    });
})(window);