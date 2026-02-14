import { RequestMethod } from "./enums/RequestMethod.js";


const headers={
    "Content-Type":"application/json"
}

export class Storage{

    static apiBase="/api/tasks";
    static invalidJSON="Invalid JSON response";

    static async createTask(taskData){

        const response=await fetch(Storage.apiBase,{
            method: RequestMethod.POST,
            headers,
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
        const response=await fetch(Storage.apiBase,{method: RequestMethod.GET});

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


    static async updateTask(taskId,taskData){

        if(!taskId)
            throw new Error("Task ID is missing.Cannot update task");
        
        const response=await fetch(`${Storage.apiBase}/${taskId}`,{
            method: RequestMethod.PATCH,
            headers,
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
}