/*
 * You generally want to .gitignore this file to prevent important credentials from being stored on your public repo.
 */
module.exports = {
    token : "secret-starter-mern",
    //mongo_connection : "mongodb+srv://rsj3:mp3UIUC@rakiuiuc.mnfgzlf.mongodb.net/mp3db?retryWrites=true&w=majority"
    mongo_connection : "mongodb://localhost:27017/cs409?retryWrites=true&w=majority"
    //example: mongo_connection : "mongodb+srv://[type-yours]:[type-yours]@[type-yours-web-provided].mongodb.net/test?retryWrites=true"
};
