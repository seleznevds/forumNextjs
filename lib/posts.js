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
                return [];
            }
            return response.data.posts;
        })
        .catch(() => {
            console.log ('Error in  postsApi getList');
            return [];
        });
    },

    getId: (id, headers = {}) => {
        return httpTransport({
            method: "get",
            url: `/api/posts/${id}`,
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
        return httpTransport({
            method: "post",
            url: "/api/posts/create",
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
        .catch((err) => {
            console.log (err);
            throw(err);
        });
    } 

};