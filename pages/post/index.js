import React, { Component } from 'react';
import { Row, Col } from "react-materialize";
import { postsApi } from '../../lib/posts';
import Post from '../../components/Post.js';
import Comments from "../../components/comments/Comments";
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import Link from 'next/link';

class PostPage extends Component {


    render() {
        return (
            <Row>
                {
                    !this.props.post ?
                        <div>Loading</div> :
                        <>
                            {this.props.showEditLink ?
                            <Col s={2}>
                                <p>
                                    <Link as={`/post/edit/${this.props.post.id}`} href={`/post/edit?postId=${this.props.post.id}`}><a>Редактировать</a></Link>
                                </p>
                            </Col> : null}
                            <Col s={12} className=""><Post post={this.props.post} isDetail /></Col>
                            <Col s={12} className=""><Comments postId={this.props.post.id} /></Col>
                        </>
                }
            </Row>
        );
    }

    static async getInitialProps({ req, res, query, user }) {
        const { postId } = query;
        
        try {
            const headers = {};
            if (req && req.headers && req.headers.cookie) {
                headers.cookie = req.headers.cookie;
            }

            let post = await postsApi.getId({ postId, headers });
                       
            let showEditLink = false;
            if(user && post && user.id === post.userId){
                showEditLink = true;
            }

            return { post, showEditLink };

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

export default withAuth(withLayout(PostPage), { loginRequired: false });