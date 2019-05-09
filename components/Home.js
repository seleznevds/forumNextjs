import React, { Component } from 'react';
import {postsApi} from '../lib/posts'
import Post from './Post.js'
import { Row, Col } from 'react-materialize'

class Home extends Component {
    
    state = {
        posts: []
    }


    componentDidMount(){
        postsApi.getList().then((posts) => {
            this.setState({
                posts
            })
        })
        .catch((error) => {
            console.log(error.message || error.toString());
        });
    }
    
    
    render() {
    
    return (
      <div className="contaner">
          <h2>Home</h2>
     
          { ! this.state.posts || ! this.state.posts.length ? <div>Loading</div> : 
          <Row>
          {this.state.posts.map((post) => {
            return  <Col s={12} className=""  key={post.id}><Post post={post}/></Col>
          })}
          </Row>              
        }     
      </div>
    );
  }
}

export default Home;
