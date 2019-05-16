import React, { Component } from 'react';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import PostForm from '../../components/PostForm';



class PostCreatePage extends Component {
    render() {
        return (<>
            <h2>Create post</h2>
            <PostForm  />
        </>);
    }
}

export default withAuth(withLayout(PostCreatePage));