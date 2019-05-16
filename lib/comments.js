import { httpTransport } from './httpTransport'

export const commentsApi = {
    getList: (postId, ancestorId = null, offset = 0, limit = 10) => {
        return httpTransport({
            method: "get",
            url: "/api/comments",
            data: {
                offset,
                limit,
                ancestorId, 
                postId
            }
        }).then((response) => {
            if(! response.data  || ! response.data.commentsList){
                console.log ('Error in  commentsApi getList:no comments');
                return {commentslist: [], commentsQuantity: 0};
            }
            return response.data;
        })
        .catch(() => {
            console.log ('Error in  commentsApi getList');
            return {commentslist: [], commentsQuantity: 0};
        });
    },   

    send: (postId, ancestorId, parentId, text, authorId, idempotencyKey) => {
        return httpTransport({
            method: "post",
            url: "/api/comments",
            data: {
                postId,
                ancestorId,
                parentId,
                text,
                authorId,
                idempotencyKey
            }
        }).then((response) => {
            if(! response.data  || ! response.data.status){
                console.log ('Error in commentsApi no status');
                throw(new Error('no status  in  commentsApi response'));
            }  
            return response.data;
        })
        .catch((e) => {
            console.log ('Error in  commentsApi send');
            return {};
        });
    }


};