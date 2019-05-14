import React, { Component } from 'react';
import { Row, Col } from "react-materialize";
import { postsApi } from '../../lib/posts';
import Post from '../../components/Post.js';
import Comments from "../../components/comments/Comments";
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

class PostPage extends Component {

    
    render() {
        return (
            <Row>
                {
                    !this.props.post ?
                        <div>Loading</div> :
                        <>
                            
                            <Col s={12} className=""><Post post={this.props.post} isDetail /></Col>
                            <Col s={12} className=""><Comments postId={this.props.post.id}/></Col>
                        </>
                }
            </Row>
        );
    }

    static async getInitialProps({ req, res, query }) {
        const { postId } = query;
        try {
            const headers = {};
            if (req && req.headers && req.headers.cookie) {
                headers.cookie = req.headers.cookie;
            }
            
            let post = await postsApi.getId(postId, headers);
            return { post };

        } catch (err) {
            console.log(err);
            if (req) {
                res.writeHead(302, { Location: `/` });
                res.end();
            } else {
                Router.push(`/`);
            }
        }
    }
}

export default withAuth(withLayout(PostPage), {loginRequired: false});