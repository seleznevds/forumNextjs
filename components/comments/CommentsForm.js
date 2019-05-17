import React, { Component } from 'react';
import { commentsApi } from '../../lib/comments';
import PropTypes from 'prop-types';
import { Textarea, Button, Row, Col, Preloader, Icon } from 'react-materialize';
import UserContext from '../../lib/UserContext';
import Router from 'next/router';
import styled from 'styled-components';


const AvatarContaner = styled.div`
  user-select: none;
  height: 60px;
  width:60px;
`;


class CommentsForm extends Component {

  state = {
    hidden: true,
    readyToSubmit: false,
    value: '',
    errorStatus: false,
    errorText: "",
    loading: false
  };

  showForm = (event) => {
    if (!this.context || !this.context.id) {
      Router.push('/login');
      return;
    }

    this.setState({
      hidden: false
    })
    event.preventDefault();
  }

  onFocusHandler = () => {
    if (!this.context || !this.context.id) {
      Router.push('/login');
      return;
    }
  }

  onChangeHandler = (event) => {
    let length = event.target.value.trim().length;

    this.setState({
      value: event.target.value,
      readyToSubmit: !!length,
      errorStatus: false,
      errorText: "",
      showPreloader: false
    });
  }

  onCancelHandler = (event) => {
    let hidden = this.props.ancestorId === null ? false : true;

    this.setState({
      value: "",
      readyToSubmit: false,
      hidden,
      errorStatus: false,
      errorText: ""
    });

    event.preventDefault();
    event.target.blur();
  }

  onSubmitHandler = (event) => {
    let value = this.state.value.trim();
    let hidden = false;
    let errorStatus = false;
    let errorText = "";

    if (value.length) {
      this.setState({
        loading: true
      });
      commentsApi.send(this.props.postId, this.props.ancestorId, this.props.parentId, value, 1, 2).then((data) => {
        if (!data.status) {
          let error = data.error || "Comment send error";
          throw (error);
        }
        value = "";
        hidden = true;
        let { comment, author } = data;
        this.props.receiveCommentHandler(comment, author);
      }).catch((error) => {
        errorStatus = true;
        errorText = error.message || error.toString();
      }).finally(() => {
        this.setState({
          value,
          readyToSubmit: !!value.length,
          hidden,
          errorStatus,
          errorText,
          loading: false
        });
      });

    }

    event.preventDefault();
  }


  render() {

    let avatar = this.context && this.context.avatarUrl ? 
      <AvatarContaner> <img className="circle responsive-img" src={this.context.avatarUrl} /></AvatarContaner>
      : <AvatarContaner> <Icon medium={true}>account_circle</Icon></AvatarContaner>;


    let form = (<div>
      <form onSubmit={this.onSubmitHandler}>
        <Row >
          <Col s={12}><Textarea id={'comment_form' + this.props.postId + (this.props.parentId ? this.props.parentId : '')} name="comment_text" s={12} placeholder="Оставьте комментарий"
            onChange={this.onChangeHandler} value={this.state.value} style={{ marginTop: '0px' }} onFocus={this.onFocusHandler} /></Col>
          <Col s={6}>{this.state.errorText}</Col>
          <Col s={6} >
            <Button className="right" type="submit" small disabled={!this.state.readyToSubmit} >Отправить</Button>
            <Button className="white right" flat small waves="teal" onClick={this.onCancelHandler}>Отмена</Button>
          </Col>
        </Row>
      </form>
    </div>);

    let formLayout;

    if (this.props.ancestorId !== null) {
      formLayout = (
        <Row >
          <Col s={2}>{this.props.voteForm}</Col>
          <Col s={10}><a href="#" onClick={this.showForm}>Ответить</a></Col>
          <Col s={12}  >
            {!this.state.loading ?
              <Row style={{ marginTop: "10px" }} hidden={this.state.hidden}>
                <Col s={1}>{avatar}</Col>
                <Col s={11} >{form} </Col>
              </Row> :
              <Row >
                <Col s={12} style={{ textAlign: "center" }} >
                  <Preloader size="small" />
                </Col>
              </Row>
            }

          </Col>
        </Row>
      );

    } else {
      formLayout = !this.state.loading ? 
        <Row>
          <Col s={1}>{avatar}</Col>
          <Col s={9} >
            <div>{form}</div>
          </Col>
        </Row>
       : <Row>
          <Col s={12} style={{ textAlign: "center" }} >
            <Preloader size="small" />
          </Col>
        </Row>;
    }

    return formLayout;

  }

  static contextType = UserContext;

  static propTypes = {
    receiveCommentHandler: PropTypes.func.isRequired
  };
}



export default CommentsForm;
