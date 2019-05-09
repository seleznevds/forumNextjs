import { httpTransport } from './httpTransport'


export default  ({elementId,  voteType, removeVoteType, moduleName}) => {
    return httpTransport({
        method: "post",
        url: `/api/votes/`,
        data:{
            elementId,
            voteType, 
            removeVoteType,
            moduleName
        }
    }).then((response) => {
        if(! response.data  || ! response.data.status){
            console.log ('Error in  votesApi no status');
            throw(new Error('no status  in  vote responce'));
        }  
        return response.data;      
    })
    .catch((error) => {
        console.log ('Error in  votesApi ', error);
        
    });
};


