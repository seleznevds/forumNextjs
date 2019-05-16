import React, { Component } from 'react';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import PostForm from '../../components/PostForm';
import Router from 'next/router';
import { postsApi } from '../../lib/posts';


class PostCreatePage extends Component {
    render() {
        return (<>
            <h2>Edit post</h2>
            <PostForm post={this.props.post} />
        </>);
    }

    static async getInitialProps({ req, res, query, user }) {

        const { postId } = query;
        try {
            const headers = {};
            if (req && req.headers && req.headers.cookie) {
                headers.cookie = req.headers.cookie;
            }

            let post = await postsApi.getId({ postId, headers, userId: user.id });
            return { post };

        } catch (err) {
            if (req) {
                res.writeHead(302, { Location: `/` });
                res.end();
            } else {

                Router.push(`/`);
            }
        }
    }


}

export default withAuth(withLayout(PostCreatePage));