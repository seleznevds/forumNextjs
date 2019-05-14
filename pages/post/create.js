import React, { Component } from 'react';
import Router from 'next/router';
import { Row, Col, TextInput, Textarea, Button, Icon, Preloader } from "react-materialize";
import { postsApi } from '../../lib/posts';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import styled from 'styled-components';

const SuccessMessage = styled.span`
  font-size:1rem;
  margin: 10px 24px 24px 24px;
  color: #26a69a;
`;

const ErrorMessage = styled.span`
  font-size:1rem;
  margin: 10px 24px 24px 24px;
  color: #ee6e73;
`;

class PostCreatePage extends Component {
    state = {
        loading: false,
        status: null,
        errorText: "",
        successText: ""

    };

    onSubmitHandler = (event) => {
        let target = event.target;

        let send = (() => {
            return () => {

                let bodyFormData = new FormData(target);

                postsApi.create(bodyFormData).then((response) => {

                    if (response.status === 'success') {
                        this.setState({
                            status: 'success',
                            errorText: "",
                            successText: response.message || 'Успех'
                        });
                        if (response.postId) {
                            Router.push(`/post/${response.postId}`);
                        }
                    } else {
                        this.setState({
                            status: 'error',
                            errorText: response.message || 'Ошибка',
                            successText: ''
                        });
                    }
                }).finally(() => {
                    this.setState({
                        loading: false
                    });
                });
            }
        })();

        if (!this.state.loading) {
            this.setState({
                loading: true
            }, send);
        }

        event.preventDefault();
    };

    render() {
        return (
            <Row>
                <form encType="multipart/form-data" name="test" onSubmit={this.onSubmitHandler}>
                    <Col s={12}><h2>Create post</h2></Col>

                    <Col s={12}><TextInput name="title" label="Tiltle" s={6} /></Col>
                    <Col s={12}><Textarea name="preview" label="Preview" s={6} /></Col>
                    <Col s={12}><Textarea name="content" label="Content" s={6} /></Col>
                    <Col s={6}>
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input name="image" type="file" />
                            </div>
                            <div className="file-path-wrapper ">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </Col>
                    <Col s={12}>
                        {this.state.loading ?
                            <Preloader size="small" /> :
                            <>
                                {this.state.status === 'success' ? <SuccessMessage>{this.state.successText}</SuccessMessage> :
                                    <Button type="submit" waves="light">Submit<Icon right>send</Icon></Button>}
                                {this.state.status === 'error' ? <ErrorMessage>{this.state.errorText}</ErrorMessage> : null}
                            </>
                        }
                    </Col>
                </form>
            </Row>
        );
    }

    static async getInitialProps({ req, res, query }) {
        return {};
    }
}

export default withAuth(withLayout(PostCreatePage));