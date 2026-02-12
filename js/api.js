export class Storage{

    static apiBase="http://localhost:3000/api/tasks";
    static invalidJSON="Invalid JSON response";

    static async createTask(taskData){

        const response=await fetch(this.apiBase,{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(taskData)
        });

        let data;
        try{
            data=await response.json();
        }
        catch{
            throw new Error(this.invalidJSON);
        }

        if(!response.ok)
            throw new Error(data.error || "Failed to create new task");

        return data;

    }

    static async getTasks(){
        const response=await fetch(this.apiBase);

        let data;
        try{
            data=await response.json();
        }
        catch{
            throw new Error(this.invalidJSON);
        }
        if(!response.ok)
            throw new Error(data.error || "Failed to get task");

        return data;
    }
}