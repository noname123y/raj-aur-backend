class ApiResponse{
    constructor(statuscode,data,message="Sucess"){
         this.statusCode=statuscode
         this.dat=data
         this.message=message
         this.sucess=statuscode<400
         
    }
}
export {ApiResponse}