class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went Wrong",
        errors=[],
        stack=""

    ){
        super(message)
        this .statusCode=statusCode
        this.errors=errors
        this.data=null
        this.sucess=false;
        this.message=message
// no special use of below code
        if(stack){
            this.stack=stack}
            else{
                Error.captureStackTrace(this,this.constructor)
            }
        }

    }
export {ApiError}