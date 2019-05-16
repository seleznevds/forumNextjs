import { httpTransport } from './httpTransport'





export const postsApi = {
    getList: ({offset = 0, limit = 10,  headers = {}} = {}) => {
        return httpTransport({
            method: "get",
            url: "/api/posts",
            data: {
                offset,
                limit
            },
            headers
        }).then((response) => {
            if(! response.data  || ! response.data.posts){
                console.log ('Error in  postsApi getList:no posts');
                return {...response.data, posts: [], postsQuantity: 0};
            }
            return response.data;
        })
        .catch(() => {
            console.log ('Error in  postsApi getList');
            return {...response.data, posts: [], postsQuantity: 0};
        });
    },

    getId: ({postId, userId=null, headers = {}} = {}) => {
        let url = `/api/posts/${postId}`;
        if(userId){
            url = `/api/posts/ifauthor/${postId}`;
        }

        return httpTransport({
            method: "get",
            url,
            headers
        }).then((response) => {
            if(! response.data  || ! response.data.post){
                console.log ('Error in  postsApi getId:no posts');
                return {};
            }
            return response.data.post;
        })
        .catch((error) => {
            console.log ('Error in  postsApi getId', error);
            throw(error);
        });
    },

    create:(data) => {
        let url = "/api/posts/create";
        
        if(data.has('id')){
            url = "/api/posts/edit";
        }
        
        
        return httpTransport({
            method: "post",
            url,
            data,
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then((response) => {
            if(response.status === 'error'){
                throw(response.message);
            }
            return response.data || {};
        })
        .catch((error) => {
            if(error.response && error.response.data){
                return error.response.data;
            }
            return {
                status: 'error',
                message: 'Неизвестная  ошибка'
            };
        });
    } 

};