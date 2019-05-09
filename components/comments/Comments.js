import React, { Component } from 'react';
import { commentsApi } from '../../lib/comments';
import Comment from './Comment';
import CommentsForm from './CommentsForm';
import { getUniqueCollectionByProp } from '../../lib/utils';
import { Preloader, Row, Col } from 'react-materialize'


class Comments extends Component {

  state = {
    comments: [],
    authors: [],
    loading: false

  };

  getAuthor(id) {
    return this.state.authors.find((author) => {
      if (id === author.id)
        return author;
    });
  }

  getComments(ancestorId = null, postId = this.props.postId, component = this, offset = 0, limit = 10) {
    component.setState({
      loading: true
    });
    return commentsApi.getList(postId, ancestorId, offset, limit).then((commentsList) => {
      if(! commentsList) {
        return;
      }
      let { comments, authors } = commentsList;

      component.setState(state => {
        comments = getUniqueCollectionByProp([...state.comments, ...comments], "id");
        authors = getUniqueCollectionByProp([...state.authors, ...authors], "id");

        return {
          comments,
          authors
        };
      });
    }).catch((error) => {
      console.log(error.message || error.toString());
    }).finally(() => {
      component.setState({
        loading: false
      });
    });;
  }


  receiveComment = (comment, author) => {
    this.setState(state => {
      return {
        comments: getUniqueCollectionByProp([comment, ...state.comments], "id"),//комментарий добавляем в начало списка
        authors: getUniqueCollectionByProp([author, ...state.authors], "id")
      }

    });
  }

  componentDidMount() {
    this.getComments();
  }


  render() {
   
    return (
      <div>
        <h4>Comments</h4>
        <CommentsForm parentId={null} ancestorId={null} postId={this.props.postId} receiveCommentHandler={this.receiveComment} />

        {this.state.comments.map(comment => {
          let author = this.getAuthor(comment.authorId);

          return (
            <Comment key={comment.id} comment={comment} author={author} getComments={this.getComments} root />
          );

        })}

        {this.state.loading ?
          <Row >
            <Col s={12} style={{ textAlign: "center" }} >
              <Preloader size="small" />
            </Col>
          </Row> : null}
      </div>
    );
  }
}

export default Comments;
