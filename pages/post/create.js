import React, { Component } from 'react';
import Router from 'next/router';
import { Row, Col, TextInput, Textarea, Button, Icon} from "react-materialize";
import { postsApi } from '../../lib/posts';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

class PostCreatePage extends Component {


    onSubmitHandler = (event) => {

        var bodyFormData = new FormData(event.target);
        postsApi.create(bodyFormData).then((response) => {
            console.log(response);
            if(response.postId){
                Router.push(`/post/${response.postId}`);
            }           
        }).catch((err) => {
            console.log('form submit error', err);
        });
       
        event.preventDefault();
    };


    
    render() {
        return (
            <Row>
                <form encType="multipart/form-data" name="test" onSubmit={this.onSubmitHandler}>
                <Col s={12}><h2>Create post</h2></Col>

                <Col s={12}><TextInput name="title" label="Tiltle" s={6} /></Col>
                <Col s={12}><Textarea name="preview" label="Preview" s={6}/></Col>
                <Col s={12}> <Textarea name="content" label="Content" s={6} /></Col>
                <Col s={6}>
                <div className="file-field input-field">
                    <div className="btn">
                    <span>File</span>
                    <input name="image" type="file"/>
                    </div>
                    <div className="file-path-wrapper ">
                    <input className="file-path validate" type="text"/>
                    </div>
                </div>            
                
                
                
                </Col>
                <Col s={12}> <Button type="submit" waves="light">Submit<Icon right>send</Icon></Button></Col>
                </form>
            </Row>
        );
    }

    static async getInitialProps({ req, res, query }) {
        return {};
    }
}

export default withAuth(withLayout(PostCreatePage));