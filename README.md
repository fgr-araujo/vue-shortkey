# VUE-SHORTKEY
==============

Vue-ShortKey - plugin for Vue.js

## Usage
Add the shortkey directive to the elements that accept the shortcut.
The shortkey must have explicitly which keys will be used.

#### Running functions
<sub>The code below ensures that the key combination ctrl + alt + o will perform the 'theAction' function.</sub>
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
<... v-shortkey.q .../>
<... v-shortkey.ctrl.p .../>
<... v-shortkey.ctrl.alt.x .../>
```
