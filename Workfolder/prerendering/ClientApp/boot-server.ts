import { createServerRenderer } from "aspnet-prerendering";

export default createServerRenderer(params =>{
    return new Promise(function(resolve,reject){
        var result="<h1>hello</h1>";

        resolve({html: result});
    })
});


