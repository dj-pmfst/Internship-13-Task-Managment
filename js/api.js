export class Storage{

    static apiBase="http://localhost:3000/api/tasks"
    static async createTask(taskData){

        const response=await fetch("apiBase",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(taskData)
        });

        if(!response.ok)
            throw new Error("Failed to create new task");

        return await response.json();

    }
}