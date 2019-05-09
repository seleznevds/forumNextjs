const postsApi = require('./posts');
const commentsApi = require('./comments');
const votesApi = require('./votes');

function api(server){
    server.use('/api/votes', votesApi);
    server.use('/api/posts', postsApi);
    server.use('/api/comments', commentsApi)
}

module.exports = api; 
