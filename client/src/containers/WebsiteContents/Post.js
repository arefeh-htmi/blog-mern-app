import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { find } from "lodash";
import { fetchPost, deletePost } from "../../actions/fetchPosts";
import { openSnackbar } from "../../actions/openSnackbar";
import { reduxForm } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Avatar,
  IconButton,
  CardHeader,
  Menu,
  MenuItem,
  // TextField,
  // Button,
  // Icon,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import {
  slashDomain,
  hasBeenText,
  getPostStatusLabel,
  // getPermalink,
  trimDescription,
} from "../../utils";
import { isUserCapable, onEditPost } from "../../utils/bloggingappcms";
import moment from "moment";
import Head from "../HeaderParts/Head";
import NotFound from "../../components/NotFound";
import Loading from "../../components/Loading";
import CategoryChips from "../../components/Lists/CategoryChips";
import TagChips from "../../components/Lists/TagChips";
import Ancestors from "../../components/Lists/Ancestors";

const styles = (theme) => ({
  postPage: {
    boxShadow: `0 1px 3px 0 ${theme.palette.primary.light}`,
    backgroundColor: "#fff",
    width: "90%",
    padding: theme.spacing.unit * 3,
    margin: "auto",
  },
  readOnlyEditorWrapper: {
    color: theme.typography.body1.color,
  },
  readOnlyEditorToolbar: {
    display: "none",
  },
  // UNCOMMENT IF YOU HAVE COMMENT
  // commentInput: {
  //   outline: "none",
  //   border: "none",
  //   display: "block",
  //   margin: 0,
  //   padding: 0,
  //   width: "800px",
  //   color: theme.palette.primary.light,
  // },
  // commentWrap: {},
  // commentBlock: {
  //   padding: theme.spacing.unit * 2,
  //   backgroundColor: "#fff",
  //   display: "table-cell",
  //   verticaAlign: "top",
  //   borderRadius: theme.spacing.unit * 1,
  //   boxShadow: `0 1px 3px 0 ${theme.palette.primary.light}`,
  // },
  // commentText: { marginBottom: theme.spacing.unit * 1.2 },
  // bottomComment: {
  //   color: theme.palette.primary.light,
  //   fontSize: 14,
  // },
  // commentdate: { float: "left" },
  // commentActions: { margin: 0, padding: 0, float: "right" },
  // commentReply: {
  //   display: "inline",
  //   margin: theme.spacing.unit * 0.2,
  //   cursor: "pointer",
  // },
  categoryChips: {
    marginBottom: theme.spacing.unit,
  },
  status: {
    paddingLeft: theme.spacing.unit,
    fontWeight: 300,
  },
  // commentCount: {
  //   paddingLeft: theme.spacing.unit,
  //   color: theme.palette.primary.light,
  // },
  empty: {
    padding: "25px 0px",
  },
  // discussion: {
  //   marginTop: theme.spacing.unit * 10,
  //   marginBottom: theme.spacing.unit * 10,
  // },
});

class Post extends Component {
  state = {
    editorState: null,
    isNotFound: null,
    anchorEl: null,
  };

  updateContent(post) {
    console.log(post);
    this.setState({
      editorState: EditorState.createWithContent(
        convertFromRaw(JSON.parse(post.content))
      ),
    });
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      type,
      post,
      match: { params },
      info: { collectionPrefix },
    } = this.props;

    if (post) this.updateContent(post);

    this.props.fetchPost(type, { ...params, collectionPrefix }, (nextPost) => {
      if (this._isMounted) {
        if (nextPost) this.updateContent(nextPost);
        else this.setState({ isNotFound: true });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleOpenMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  onDeleteClick = (post_id) => {
    const {
      type,
      history,
      info: { domain },
    } = this.props;

    this.props.deletePost(type, post_id, (data) => {
      const snackbarActionText =
        data.status === "trash" ? "put to bin" : "deleted";

      history.push(`${slashDomain(domain)}/`);
      this.props.openSnackbar(
        hasBeenText(type, data.title, snackbarActionText)
      );
    });
  };

  render() {
    const { post } = this.props;
    const { editorState, isNotFound } = this.state;

    if (isNotFound) {
      return <NotFound />;
    } else if (!post || !editorState) {
      return <Loading />;
    } else {
      const {
        type,
        user,
        history,
        classes,
        info: { domain },
      } = this.props;
      const { anchorEl } = this.state;
      const deleteText = post.status !== "trash" ? "Bin" : "Delete";

      const isDeleteEnabled = isUserCapable("delete", type, user, post);
      const isEditEnabled = isUserCapable("edit", type, user, post);

      const description = trimDescription(
        editorState.getCurrentContent().getPlainText()
      );

      return (
        <div className={classes.postPage}>
          <Head name={post.title} description={description} />
          <Typography variant="h6">{post.title}</Typography>
          <CardHeader
            avatar={
              <Avatar aria-label="Author">
                {post.author.username.charAt(0)}
              </Avatar>
            }
            action={
              isDeleteEnabled || isEditEnabled ? (
                <div>
                  <IconButton
                    aria-owns={anchorEl ? post._id : null}
                    aria-haspopup="true"
                    onClick={this.handleOpenMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={post._id}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleCloseMenu}
                  >
                    {isEditEnabled && (
                      <MenuItem
                        onClick={() =>
                          onEditPost(type, post._id, domain, history)
                        }
                      >
                        Edit Post
                      </MenuItem>
                    )}
                    {isDeleteEnabled && (
                      <MenuItem onClick={() => this.onDeleteClick(post._id)}>
                        {deleteText}
                      </MenuItem>
                    )}
                  </Menu>
                </div>
              ) : null
            }
            title={
              type === "post" ? (
                <CategoryChips
                  categories={post.categories}
                  domain={domain}
                  history={history}
                  className={classes.categoryChips}
                />
              ) : (
                <Ancestors
                  type="page"
                  items={post.ancestors}
                  childName={post.title}
                  domain={domain}
                />
              )
            }
            subheader={
              <div>
                <span>{moment(post.date).format("dddd, MMMM D, YYYY")}</span>
                <span className={classes.status}>
                  ({getPostStatusLabel(post.status)})
                </span>

                
              </div>
            }
          />
          {editorState.getCurrentContent().hasText() ? (
            <Editor
              editorState={editorState}
              readOnly
              wrapperClassName={classes.readOnlyEditorWrapper}
              toolbarClassName={classes.readOnlyEditorToolbar}
            />
          ) : (
            <Typography
              variant="subtitle1"
              gutterBottom
              align="center"
              className={classes.empty}
            >
              Nothing to show
            </Typography>
          )}
          {type === "post" && (
            <TagChips tags={post.tags} domain={domain} history={history} />
          )}
          {/* UNCOMMENT IF YOU HAVE COMMENT */}
          {/* <div className={classes.discussion}>
            <div className={classes.commentWrap}>
              <div className={classes.commentBlock}>
                <p className={classes.commentText}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Iusto temporibus iste nostrum dolorem natus recusandae
                  incidunt voluptatum. Eligendi voluptatum ducimus architecto
                  tempore, quaerat explicabo veniam fuga corporis totam
                  reprehenderit quasi sapiente modi tempora at perspiciatis
                  mollitia, dolores voluptate. Cumque, corrupti?
                </p>
                <div className={classes.bottomComment}>
                  <div className={classes.commentdate}>
                    Aug 24, 2014 @ 2:35 PM
                  </div>
                  <ul className={classes.commentActions}>
                    <li className={classes.commentReply}>Reply</li>
                  </ul>
                </div>
              </div>
            </div>
            <form noValidate autoComplete="off">
              <TextField
                id="comment"
                label=""
                fullWidth
                variant="outlined"
                placeholder="Add a new comment"
                className={classes.commentInput}
              />
              <Button
                variant="contained"
                className={classes.button}
                endIcon={<Icon>send</Icon>}
                color="success"
                onClick={() => {
                  alert("clicked");
                }}
              />
            </form>
          </div> */}
        </div>
      );
    }
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object,
  site: PropTypes.object.isRequired,
  fetchPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};

function mapStateToProps(
  { info, posts, pages, sites, auth: { user } },
  ownProps
) {
  const {
    type,
    match: { params },
  } = ownProps;
  let post;

  switch (type) {
    case "post":
      post = find(posts, (o) => {
        const date = new Date(o.date);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        return (
          o.slug === params.slug &&
          year === Number(params.year) &&
          month === Number(params.month) &&
          day === Number(params.day)
        );
      });
      break;
    case "page":
      post = find(pages, (o) => o.slug === params.slug);
      break;
    default:
      break;
  }

  return { info, user, post, site: sites[info.domain] };
}

export default connect(mapStateToProps, {
  fetchPost,
  deletePost,
  openSnackbar,
})    (withStyles(styles)(Post));

// UNCOMMENT IF YOU HAVE COMMENT

// const wrappedPost = connect(mapStateToProps, {
//   fetchPost,
//   deletePost,
//   openSnackbar,
// })(
//   reduxForm({
//     form: "comment",
//   })(Post)
// );

// export default withStyles(styles)(wrappedPost);
