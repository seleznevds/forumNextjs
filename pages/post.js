import React, { Component } from 'react';
import { postsApi } from '../lib/posts'
import Post from '../components/Post.js'
import { Row, Col } from "react-materialize";
import Comments from "../components/comments/Comments";

import Link from 'next/link';

class PostPage extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Row>
                <>
                    <h2>Detail</h2>
                    <Link href="/"><a>На главную</a></Link>
                    
                </>
                {
                    !this.props.post ?
                        <div>Loading</div> :
                        <>
                            
                            <Col s={12} className=""><Post post={this.props.post} isDetail /></Col>
                            <Col s={12} className=""><Comments postId={this.props.post.id} /></Col>
                        </>
                }
            </Row>
        );
    }

    static async getInitialProps({ req, res, query }) {
        if (req) {
            console.log('server side1');
        } else {
            console.log('client side');
        }

        const { postId } = query;
        try {
            let post = await postsApi.getId(postId);
            return { post }

        } catch (err) {
            console.log(err);
            if (req) {
                console.log('server side')
                res.writeHead(302, { Location: `/` })
                res.end()
            } else {
                console.log('client side')
                Router.push(`/`)
            }
        }
    }
}

export default PostPage;