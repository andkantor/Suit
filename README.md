README
======

What is Suit?
-------------

Suit is a micro JavaScript framework to make your life easier. The general
idea is to extend HTML elements behaviour in a very elegant way. You just
specify an attribute on your HTML element and Suit will do the rest.

Browser Support
---------------

IE 9, Firefox 4, Chrome 4, Safari 3.1, Opera 10.1
iOS Safari 3.2, Opera Mini 8, Android 2.1

Manual
------

Here is our first div. We have set the suit attribute on it, with the
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

You can inject dependencies into suits by setting the dependencies property on
the suit.

```javascript
var isHungry = true;
Suit.DI.set('fridge', { egg: 5, tomato: 2 });

Person = function (isHungry, fridge) {
    this.isHungry = isHungry;
    this.fridge = fridge;

    this.eat = function () {
        if (this.isHungry) {
            this.fridge.egg--;
            this.fridge.tomato--;
        } else {
            console.log('Maybe later, but thanks.');
        }
    }
};
Person.dependencies = ['isHungry', '@fridge'];
```

As you can see, the first dependency will be searched in the global namespace,
and the second is a service which has been set into the DI container before.