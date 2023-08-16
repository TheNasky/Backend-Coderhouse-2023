export const generateUserErrorInfo = (user) =>{
   return `one or more properties were incomplete or not valid.
   list of required properties:
   *firstName    : needs to be a String, Received: ${user.firstName}
   *lastName     : needs to be a String, Received: ${user.lastName}
   *email        : needs to be a String, Received ${user.email}`
}