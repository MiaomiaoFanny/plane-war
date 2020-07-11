import { createApp } from './src/runtime-canvas'
import App from './src/App'
import { getStage } from './src/game'

createApp(App).mount(getStage())