import React from 'react';
import { postsApi } from '../lib/posts';
import Post from '../components/Post';
import { Row, Col } from 'react-materialize';
import withLayout from '../lib/withLayout';
import withAuth from '../lib/withAuth';
import Link from 'next/link';

class Index extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.posts && this.props.posts.map((post) => {
                    return  <Col s={12} className=""  key={post.id}><Post post={post}/></Col>
                })}
            </div>
        );
    }


    static async getInitialProps({ req, query, pathname }) {
        try {
            const headers = {};
            if (req && req.headers && req.headers.cookie) {
                headers.cookie = req.headers.cookie;
            }
            
            let posts = await postsApi.getList({headers});
            return {
                posts
            };
        } catch (error) {
            return {
                posts: []
            }
        }
    }

}

export default withAuth(withLayout(Index),  {loginRequired: false});