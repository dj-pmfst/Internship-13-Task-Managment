import { UI } from "./UI.js";

document.addEventListener("DOMContentLoaded",async ()=>{
    const ui=new UI();
    await ui.loadTasks();
    await ui.loadArchivedTasks();
});