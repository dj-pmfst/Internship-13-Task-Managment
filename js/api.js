export class Storage{

    static apiBase="/api/tasks";
    static invalidJSON="Invalid JSON response";

    static async createTask(taskData){

        const response=await fetch(Storage.apiBase,{
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
            console.warn(Storage.invalidJSON);
        }

        if(!response.ok){
            const message=data?.error || `HTTP error ${response.status}`;
            throw new Error(message);
        }

        return data;

    }

    static async getTasks(){
        const response=await fetch(Storage.apiBase);

        let data;
        try{
            data=await response.json();
        }
        catch{
            console.warn(Storage.invalidJSON);
        }
        if(!response.ok){
            const message=data?.error || `HTTP error ${response.status}`;
            throw new Error(data.error || "Failed to get task");            
        }

        return data;
    }
}