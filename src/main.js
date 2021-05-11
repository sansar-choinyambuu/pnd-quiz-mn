import { createApp } from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics';

const app = createApp(App)
app.mount('#app')

// Configuration VueAnalytics
app.use(VueAnalytics, {
    id: '271704221'
  });
