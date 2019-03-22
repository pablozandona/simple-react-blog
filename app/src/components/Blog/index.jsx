import React from 'react';
import {connect} from 'react-redux';
import Header from "../Header";
import moment from "moment";
import {blogService, userService} from "../../services";
import {Alert} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import NewPost from "../NewPost";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

class Blog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userIsOwner: false,
            modalLoginShow: false,
            modalNewPostShow: false,
            category: '',
            subCategory: '',
            posts: [],
            blog: {},
            loading: true
        };
    }

    verifyLoggedUser() {
        const user = userService.hasLogin();
        user ? this.props.setUser(user) : null;
    }

    componentDidMount() {

        this.verifyLoggedUser();

        const {id} = this.props.match.params;

        blogService.getBlog(id).then(r => {
            this.setState({blog: {...r}});
            this.getPosts();
            this.verifyOwner();
        }, e => {
            this.setState({error: true});
        });

    }

    getPosts() {
        blogService.getPosts(this.state.blog._id).then(r => {
            this.setState({posts: r, loading: false });
        }, e => {
            this.setState({error: true});
        });
    }

    verifyOwner() {
        console.log('verifyOwner',this.state.blog.owner, this.props.user )
        if(this.props.user) {
            this.setState({userIsOwner: this.state.blog.owner === this.props.user._id});
        }
    }

    render() {
        const {posts, blog, error, modalNewPostShow, modalLoginShow, userIsOwner, loading} = this.state;
        const {isLogged} = this.props;

        let createNewPost = () => {
            if (isLogged) {
                this.setState({modalNewPostShow: true});
            } else {
                this.setState({modalLoginShow: true});
            }
        };

        return (

            <div style={{marginTop: '56px'}}>
                <NewPost
                    show={modalNewPostShow}
                    blog={blog._id}
                    onHide={() => this.setState({modalNewPostShow: false})}
                    closemodal={() => {
                        this.setState({modalNewPostShow: false});
                        this.getPosts()
                    }}
                />
                <Header closemodal={() => {
                    this.verifyOwner();
                }}/>
                <section className="jumbotron text-center container">
                    <div className="container">
                        <h1 className="jumbotron-heading">{blog.title}</h1>
                        <p className="lead text-muted">{blog.description}</p>
                        {isLogged && userIsOwner && !error && posts.length > 0 &&
                        <Button onClick={createNewPost} variant="warning" className="float-md-right">
                            NOVO POST
                        </Button>}
                    </div>
                    {error &&
                    <Alert variant="danger">
                        <Alert.Heading>O Blog não existe!</Alert.Heading>
                    </Alert>}
                </section>

                <div className="row justify-content-md-center">
                    {isLogged && userIsOwner && !error && !posts.length && !loading &&
                    <div className="d-flex justify-content-center">
                        <h4 className="mr-5">Crie seu primeiro post!</h4>
                        <Button onClick={createNewPost} variant="warning">
                            CRIAR
                        </Button>
                    </div>}
                    {!isLogged && !error && !posts.length && !loading &&
                    <div className="d-flex justify-content-center">
                        <h4 className="mr-5">O Blog ainda não possui posts...</h4>
                    </div>}
                    {posts.map((post) => {
                        return (
                            <div className="card mb-3 col-md-8">
                                <div className="card-body">
                                    <p className="card-text">
                                        <OverlayTrigger overlay={<Tooltip>{moment(new Date(post.date)).format('DD/MM/YYYY HH:mm:ss')}</Tooltip>}>
                                            <small className="text-muted">{moment(post.date).fromNow()}</small>
                                        </OverlayTrigger>
                                    </p>
                                    <h3 className="pb-3">{post.title}</h3>
                                    <p>{post.content}</p>

                                    {post.sections.map((section) => {
                                        return (
                                            <div className="ml-5">
                                                <h5>{section.title}</h5>
                                                <p>{section.content}</p>
                                                {section.subSections.map((subSection) => {
                                                    return (
                                                        <div className="ml-5 mt-3">
                                                            <h6>{subSection.title}</h6>
                                                            <p>{subSection.content}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLogged: state.home.isLogged,
    user: state.home.user,
});

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch({type: 'SET_USER', user}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
