README
======

What is Suit?
-------------

Suit is a micro JavaScript framework to make your life easier. The general
idea is to extend HTML elements behaviour in a very elegant way. You just
specify an attribute on your HTML element and Suit will do the rest.

Browser Support
---------------

IE 9, Firefox 4, Chrome 4, Safari 3.1, Opera 10.1,
iOS Safari 3.2, Opera Mini 8, Android 2.1

Manual
------

Here is our first div. We have set the suit attribute on it with the
function's global name we want to extend with.

```html
<div id="myDiv" suit="DisplayTrait">Welcome here! :)</div>

<script type="text/javascript" src="/Suit.js"></script>
<script type="text/javascript">
    DisplayTrait = function () {
        this.show = function () {
            this.style.display = 'block';
        };

        this.hide = function () {
            this.style.display = 'none';
        }
    };
</script>
```

Now we can show/hide our div element by calling the appropriate method.

```javascript
var myDiv = document.getElementById('myDiv');

myDiv.hide(); // will hide the div
myDiv.show(); // will show the div
```

You can set more suits in one element by separating them with semicolon. If
two suits have property with the same name, then the second will overwrite
the first.

You can inject dependencies into suits by setting the dependencies property on it.

```javascript
var isHungry = true;
Suit.DI.set('fridge', { egg: 5, tomato: 2 });

Person = function (isHungry, fridge, age) {
    this.isHungry = isHungry;
    this.fridge = fridge;
    this.age = age;

    this.eat = function () {
        if (this.isHungry) {
            this.fridge.egg--;
            this.fridge.tomato--;
        } else {
            console.log('Maybe later, but thanks.');
        }
    }
};
Person.dependencies = ['{isHungry}', '@fridge', 27];
```

There are 3 types of dependencies:
1. Global variable. The name of the global variable between curly braces.
2. Service. The name of the service after a @. Should be registered in the Suit.DI container.
3. Any other types of variable or literal.