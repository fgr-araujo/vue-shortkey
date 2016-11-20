# VUE-SHORTKEY
==============

Vue-ShortKey - plugin for Vue.js

## Install
```
npm install vue-shortkey --save
```

## Usage
```javascript
Vue.use(require('vue-shortkey'))
```
Add the shortkey directive to the elements that accept the shortcut.
The shortkey must have explicitly which keys will be used.

#### Running functions
<sub>The code below ensures that the key combination ctrl + alt + o will perform the 'theAction' method.</sub>
```html
<button v-shortkey.ctrl.alt.o="theAction">Open</button>
```

#### Setting the focus
If the name of a function is not informed, the element will receive the focus.
<sub>The code below reserves the F2 key to set the focus to the input element.</sub>
```html
<input type="text" v-shortkey.f2 v-model="name" />
```

#### Push button
Sometimes you may need a shortcut key to work as a push button. In these cases, insert the "push" modifier

The example below shows how to do this
```html
<tooltip v-shortkey.push.alt="toggleToolTip"></tooltip>
```


#### Key list
| Key         | Shortkey Name |
|-------------|---------------|
| Shift       | shift         |
| Control     | ctrl          |
| Alt         | alt           |
| Alt Graph   | altgraph      |
| Arrow Up    | arrowup       |
| Arrow Down  | arrowdown     |
| Arrow Left  | arrowleft     |
| Arrow Right | arrowright    |
| A - Z       | a-z           |

You can make any combination of keys as well as reserve a single key.
```html
<input type="text" v-shortkey.q />
<button v-shortkey.ctrl.p="foo()"></button>
<textarea v-shortkey.ctrl.alt.x></textarea>
```

#### Avoided fields
You can avoid shortcuts within fields if you really need it. This can be done in two ways:
* Preventing a given element from executing the shortcut by adding the **v-shortkey**.void tag in the body of the element
```html
<textarea v-shortkey.void></textaea>
```
* Generalizing type of element that will not perform shortcut. To do this, insert a list of elements in the global method.
```javascript
Vue.use('vue-shortkey', { prevent: ['input', 'textarea'] })
```
