# vue-shortkey

## Installation

`npm install vue-shortkey --save` or `yarn add vue-shortkey`  

```javascript
import ShortKey from 'vue-shortkey'
Vue.use(ShortKey)
```

## Example usage
```
// On "click" & on CTRL+n, run a function to open a modal
<button class="primary" 
      v-shortkey="['ctrl','n']"
      @shortkey="$refs.newUserModal.open()"
      @click="$refs.newUserModal.open()" >
          New User
</button>
```
