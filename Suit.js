(function (window) {
    var document = window.document;
    var index, key, prop, dependencies;

    window.Function.prototype.suitConstruct = function (args) {
        var self = this,
            func = function () { self.apply(this, args); };
        func.prototype = self.prototype;
        return new func();
    };

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
            Suit.each(suits.split(';'), function (i, suitClass) {
                suitClass = Suit.classify(suitClass);

                if (suitClass !== undefined) {
                    Suit.copy(element, Suit.factory(suitClass));
                }
            });
        },
        classify: function (classString, namespace) {
            namespace = namespace || window;

            if ((index = classString.indexOf('.')) === -1) {
                return namespace[classString];
            }

            return Suit.classify(
                classString.substring(index + 1, classString.length),
                namespace[classString.substring(0, index)]
            );
        },
        copy: function(destination, source) {
            for (prop in source) {
                if (source[prop] != null) {
                    destination[prop] = source[prop];
                }
            }
        },
        factory: function (suitClass) {
            dependencies = [];

            if (suitClass.hasOwnProperty('dependencies')) {
                Suit.each(suitClass.dependencies, function (i, dependency) {
                    if (dependency.indexOf('#') === 0) {
                        dependencies.push(document.getElementById(Suit.toId(dependency)));
                    } else if (dependency.indexOf('@') === 0) {
                        dependencies.push(Suit.DI.get(Suit.toId(dependency)));
                    } else {
                        dependencies.push(Suit.classify(dependency));
                    }
                });
            }

            return suitClass.suitConstruct(dependencies);
        },
        toId: function (str) {
            return str.substring(1, str.length);
        }
    };

    Suit.DI = {
        services: {},
        get: function (id) {
            return this.services[id];
        },
        set: function (id, service) {
            this.services[id] = service;
        }
    };

    Suit.bind(document, 'DOMContentLoaded', function () {
        Suit.each(document.querySelectorAll('[suit]'), function (i, element) {
            Suit.up(element, element.getAttribute('suit'));
        });
    });
})(window);