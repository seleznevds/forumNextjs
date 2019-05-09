import { httpTransport } from './httpTransport'





export const postsApi = {
    getList: (offset = 0, limit = 10) => {
        return httpTransport({
            method: "get",
            url: "/api/posts",
            data: {
                offset,
                limit
            }
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

    getId: (id) => {
        return httpTransport({
            method: "get",
            url: `/api/posts/${id}`
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

};