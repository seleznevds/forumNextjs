import React from 'react';
import styled from 'styled-components';
import { postsApi } from '../lib/posts';
import Post from '../components/Post';
import { Row, Col } from 'react-materialize';
import withLayout from '../lib/withLayout';
import withAuth from '../lib/withAuth';



const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

class Index extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <Title>This is the about page</Title>
                {this.props.posts && this.props.posts.map((post) => {
                    return  <Col s={12} className=""  key={post.id}><Post post={post}/></Col>
                })}
            </div>
        );
    }


    static async getInitialProps({ req, query, pathname }) {
        try {
            let posts = await postsApi.getList();
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