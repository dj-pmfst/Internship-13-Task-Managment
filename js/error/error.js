export class UserCancelledError extends Error{
    constructor(message="Task creation cancelled"){
        super(message);
        this.name="UserCancelledError";
    }
}
