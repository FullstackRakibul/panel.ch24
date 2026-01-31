import "./assets/main.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"

import { createApp } from "vue"
import { createPinia } from "pinia"
import ElementPlus from "element-plus"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

import App from "./App.vue"
import router from "./router"

// Import permission directives
import { vCan, vCanAny, vCanAll } from "@/directives/v-can"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// Register Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Register permission directives globally
app.directive('can', vCan)
app.directive('can-any', vCanAny)
app.directive('can-all', vCanAll)

app.mount("#app")
