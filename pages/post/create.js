import React, { Component } from 'react';
import Link from 'next/link';
import { Row, Col, TextInput, Textarea, Button} from "react-materialize";
import { postsApi } from '../../lib/posts';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

class PostCreatePage extends Component {

    
    render() {
        return (
            <Row>
                <form >
                <Col s={12}><h2>Create post</h2></Col>

                <Col s={12}><TextInput label="Tiltle" s={6} /></Col>
                <Col s={12}><Textarea label="Preview" s={6}/></Col>
                <Col s={12}> <Textarea label="Content" s={6} /></Col>
                <Col s={6}>
                <div className="file-field input-field">
                    <div className="btn">
                    <span>File</span>
                    <input type="file"/>
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