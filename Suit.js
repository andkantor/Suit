var Suit;

(function (window) {
    var document = window.document;
    var index, key, prop, object, suitClass, dependencies;

    Suit = {
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
        up: function (element, classString) {
            suitClass = Suit.classify(classString);

            if (suitClass === undefined) {
                console.log('Undefined class: ' + classString);
            } else {
                Suit.copy(element, Suit.factory(suitClass));
            }
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
            if (source.prototype) {
                Suit.copy(destination, source.prototype);
            }

            for (prop in source) {
                if (prop !== 'prototype' && source[prop] != null) {
                    if (
                        source[prop]
                        && source[prop].constructor
                        && source[prop].constructor === Object
                    ) {
                        destination[prop] = destination[prop] || source[prop];
                        Suit.copy(destination[prop], source[prop]);
                    } else {
                        destination[prop] = source[prop];
                    }
                }
            }
        },
        factory: function (suitClass) {
            object = {};
            dependencies = [];

            if (suitClass.hasOwnProperty('dependencies')) {
                Suit.each(suitClass.dependencies, function (i, dependency) {
                    if (dependency.indexOf('#') === 0) {
                        dependencies.push(document.getElementById(dependency.substring(1, dependency.length)));
                    } else {
                        dependencies.push(Suit.classify(dependency));
                    }
                });
            }

            suitClass.apply(object, dependencies);
            object.prototype = suitClass.prototype;

            return object;
        }
    };

    Suit.bind(document, 'DOMContentLoaded', function () {
        Suit.each(document.querySelectorAll('[suit-class]'), function (i, element) {
            Suit.up(element, element.getAttribute('suit-class'));
        });
    });
})(window);