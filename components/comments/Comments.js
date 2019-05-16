import React, { Component } from 'react';
import { commentsApi } from '../../lib/comments';
import Comment from './Comment';
import CommentsForm from './CommentsForm';
import { getUniqueCollectionByProp } from '../../lib/utils';
import { Preloader, Row, Col } from 'react-materialize';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';



let StyledPreloadercontaner = styled.div`
    height:85px;
    overflow: hidden;
`;

let StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0 12px;
`;




class Comments extends Component {

  state = {
    comments: [],
    authors: [],
    loading: false,
    commentsQuantity: 0

  };

  getAuthor(id) {
    return this.state.authors.find((author) => {
      if (id === author.id)
        return author;
    });
  }

  getMoreComments = () => {
    this.getComments({ offset: this.state.comments.length, limit: 1 });
  }

  getComments({ ancestorId = null, postId = this.props.postId, component = this, offset = 0, limit = 2 } = {}) {
    component.setState({
      loading: true
    });
    return commentsApi.getList(postId, ancestorId, offset, limit).then(({ commentsList, commentsQuantity }) => {
      if (!commentsList) {
        return;
      }
      let { comments, authors } = commentsList;

      component.setState(state => {
        comments = getUniqueCollectionByProp([...state.comments, ...comments], "id");
        authors = getUniqueCollectionByProp([...state.authors, ...authors], "id");

        return {
          comments,
          authors,
          commentsQuantity
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
   this.getComments({ limit: 1 });
  }


  render() {

    let loader = (
      <Col s={12} style={{ textAlign: "center" }} >
        <StyledPreloadercontaner><Preloader size="small" /></StyledPreloadercontaner>
      </Col>
    );

    return (
      <>
        <h4>Comments</h4>
        <CommentsForm parentId={null} ancestorId={null} postId={this.props.postId} receiveCommentHandler={this.receiveComment} key={this.props.postId}/>
        <StyledInfiniteScroll
          dataLength={this.state.comments.length}
          next={this.getMoreComments}
          hasMore={this.state.comments.length < this.state.commentsQuantity}
          >
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
        </StyledInfiniteScroll>

      </>
    );
  }
}

export default Comments;
