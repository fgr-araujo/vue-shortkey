![vue-shortkey logo](https://github.com/iFgR/vue-shortkey/blob/master/logo/shortkey.png?raw=true)

Vue-ShortKey - plugin for VueJS 2.x accepts shortcuts globaly and in a single listener.

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
<button v-shortkey="['ctrl', 'alt', 'o']" @shortkey="theAction()">Open</button>
```
The function in the modifier __@shortkey__ will be called repeatedly while the key is pressed. To call the function only once, use the __once__ modifier
```html
<button v-shortkey.once="['ctrl', 'alt', 'o']" @shortkey="theAction()">Open</button>
```

#### Setting the focus
You can point the focus with the shortcut easily.
<sub>The code below reserves the ALT + I key to set the focus to the input element.</sub>
```html
<input type="text" v-shortkey.focus="['alt', 'i']" v-model="name" />
```

#### Push button
Sometimes you may need a shortcut works as a push button. In these cases, insert the "push" modifier

The example below shows how to do this
```html
<tooltip v-shortkey.push="['f3']" @shortkey="toggleToolTip"></tooltip>
```

#### Key list
| Key         | Shortkey Name |
|-------------|---------------|
| Shift       | shift         |
| Control     | ctrl          |
| Alt         | alt           |
| Alt Graph   | altgraph      |
| Super (Windows or Mac Cmd)   | meta      |
| Arrow Up    | arrowup       |
| Arrow Down  | arrowdown     |
| Arrow Left  | arrowleft     |
| Arrow Right | arrowright    |
| Enter | enter    |
| Escape | escape    |
| Tab | tab    |
| A - Z       | a-z           |

You can make any combination of keys as well as reserve a single key.
```html
<input type="text" v-shortkey="['q']" @shortkey="foo()"/>
<button v-shortkey="['ctrl', 'p']" @shortkey="bar()"></button>
<button v-shortkey="['f1']" @shortkey="help()"></button>
<textarea v-shortkey="['ctrl', 'v']" @shortkey="dontPaste()"></textarea>
```

#### Avoided fields
You can avoid shortcuts within fields if you really need it. This can be done in two ways:
* Preventing a given element from executing the shortcut by adding the **v-shortkey.avoid** tag in the body of the element
```html
<textarea v-shortkey.avoid></textaea>
```
* Generalizing type of element that will not perform shortcut. To do this, insert a list of elements in the global method.

```javascript
Vue.use('vue-shortkey', { prevent: ['input', 'textarea'] })
```
* Or even by class
```javascript
Vue.use('vue-shortkey', { prevent: ['.my-class-name', 'textarea.class-of-textarea'] })
```

#### Other uses
With the dynamism offered by Vue, you can easily create shortcuts dynamically
```html
<li v-for="(ctx, item) in itens">
  <a
    href="https://vuejs.org"
    target="_blank"
    v-shortkey="['f' + (item + 1)]"
    @shortkey="testa(item)"
    @click="testa()">
      F {{ item }}
  </a>
</li>
```
