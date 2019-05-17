import React from 'react';
import { postsApi } from '../lib/posts';
import Post from '../components/Post';
import { Col, Preloader } from 'react-materialize';
import withLayout from '../lib/withLayout';
import withAuth from '../lib/withAuth';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

let limit = 2;


let StyledPreloadercontaner = styled.div`
    height:85px;
    overflow: hidden;
`;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    getMorePosts = async () => {
        try {
            let { posts, postsQuantity } = await postsApi.getList({ 
                offset: this.state.posts.length,
                limit,
                headers: this.state.headers});

            this.setState((state) => {
                return {
                    postsQuantity,
                    posts: [...state.posts, ...posts]
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    render() {

        let loader = (
            <Col s={12} style={{ textAlign: "center" }} >
               <StyledPreloadercontaner><Preloader size="small" /></StyledPreloadercontaner> 
            </Col>
        );

        return (
            <div>
                <InfiniteScroll
                    dataLength={this.state.posts.length}
                    next={this.getMorePosts}
                    hasMore={this.state.posts.length < this.state.postsQuantity}
                    loader={loader} >
                    {this.state.posts && this.state.posts.map((post) => {
                        return <Col s={12} className="" key={post.id}><Post post={post} /></Col>;
                    })}
                </InfiniteScroll>

            </div>
        );
    }

    static async getInitialProps({ req }) {
        try {
            const headers = {};

            if (req && req.headers && req.headers.cookie) {
                headers.cookie = req.headers.cookie;
            }

            let { posts, postsQuantity } = await postsApi.getList({ offset: 0, limit, headers });
            return {
                posts,
                postsQuantity
            };
        } catch (error) {
            return {
                posts: [],
                postsQuantity: 0,
                headers: {}
            }
        }
    }
}

export default withAuth(withLayout(Index), { loginRequired: false });