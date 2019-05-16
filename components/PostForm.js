import React, { Component } from 'react';
import Router from 'next/router';
import { Row, Col, TextInput, Textarea, Button, Icon, Preloader } from "react-materialize";
import { postsApi } from '../lib/posts';
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

const StyledImagecontaner = styled.div`
  font-size:1rem;
  margin: 10px 0;
  
  max-width: 200px;
  max-heigth:200px;
  overflow: hidden;
`;

const StyledInput = styled(TextInput)`
    ${props => props.invalid ? 'border-bottom-color:red !important; border-bottom-width: 2px !important; box-shadow:none !important;' : ''}
`;

const StyledTextarea = styled(Textarea)`
    ${props => props.invalid ? 'border-bottom-color:red !important; border-bottom-width: 2px !important; box-shadow:none !important;' : ''}
`;


class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            status: null,
            errorText: "",
            successText: "",
            test: true,
            fields: {
                content: '',
                title: '',
                preview: '',
                image: ''
            },

            requiredFields: new Set(['content', 'title'])
        };

        if (props.post) {
            this.state.fields.title = props.post.title || '';
            this.state.fields.content = props.post.text || '';
            this.state.fields.preview = props.post.preview || '';
            this.state.fields.image = props.post.image || '';
        }
    }

    onSubmitHandler = (event) => {
        event.preventDefault();

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
                        if (response.postId && ! this.props.post) {
                            Router.push(`/post/${response.postId}`);
                        }

                        if(response.image){
                            this.state.fields.image  = response.image;
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


        let invalidFields = [];
        for (let name of this.state.requiredFields) {
            let value = this.state.fields[name].trim();
            if (!value.length) {
                invalidFields.push(name);
            }
        }

        if (invalidFields.length) {
            let updateState = {}

            invalidFields.forEach((name) => {
                updateState[`${name}Invalid`] = true;
            });

            this.setState({
                ...updateState,
                status: 'error',
                errorText: "Необходимо заполнить обязательные поля",
                successText: ""
            });

            return;
        }

        if (!this.state.loading) {
            this.setState({
                loading: true
            }, send);
        }
    };

    onChangeHandler = (event) => {
        let input = event.target;
        this.setState({
            fields: {
                ...this.state.fields,
                [input.name]: event.target.value
            }
        });

        if (this.state.requiredFields.has(input.name)) {
            let value = input.value.trim();
            if (!value.length) {
                this.setState({
                    [input.name + 'Invalid']: true
                });
            } else {
                this.setState({
                    [input.name + 'Invalid']: false
                });
            }
        }
    };

    render() {
        return (
            <Row>
                <form encType="multipart/form-data" name="test" onSubmit={this.onSubmitHandler}>
                    

                    <Col s={12}>
                        <StyledInput name="title" label="Tiltle" s={6} onChange={this.onChangeHandler}
                            invalid={this.state.titleInvalid ? 1 : 0} value={this.state.fields.title} />
                    </Col>
                    <Col s={12}>
                        <StyledTextarea name="preview" label="Preview" s={6} onChange={this.onChangeHandler} value={this.state.fields.preview} />
                    </Col>
                    <Col s={12}>
                        <StyledTextarea invalid={this.state.contentInvalid ? 1 : 0} name="content" label="Content" s={6}
                            onChange={this.onChangeHandler} value={this.state.fields.content} />
                    </Col>
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

                    {this.state.fields.image ?
                        <Col s={3}>
                            <p>Если  вы загрузите новое  изображение , то  текущее изображение  будет  удалено</p>
                            <StyledImagecontaner><img src={this.state.fields.image} className="responsive-img" /></StyledImagecontaner>
                        </Col>
                        : null}


                    <Col s={12}>
                        {this.state.loading ?
                            <Preloader size="small" /> :
                            <>
                                 {this.state.status === 'success' && ! this.props.post ? null :
                                    <Button type="submit" waves="light">Submit<Icon right>send</Icon></Button>}
                                {this.state.status === 'success' ? <SuccessMessage>{this.state.successText}</SuccessMessage> : null}
                                {this.state.status === 'error' ? <ErrorMessage>{this.state.errorText}</ErrorMessage> : null}
                            </>
                        }
                    </Col>
                    {this.props.post && this.props.post.id ? <input type="hidden" name="id" value={this.props.post.id} /> : null}
                </form>
            </Row>
        );
    }


}

export default PostForm;