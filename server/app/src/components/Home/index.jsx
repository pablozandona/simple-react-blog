import React from 'react';
import {connect} from 'react-redux';
import Header from "../Header";
import BlogCard from "../BlogCard";
import {blogService, userService} from "../../services";
import Login from "../Login";
import {NewBlog} from "../index";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            modalNexBlogShow: false,
            modalLoginShow: false,
        };
    }

    verifyLoggedUser() {
        const user = userService.hasLogin();
        user ? this.props.setUser(user) : null;
    }

    componentDidMount() {
        this.verifyLoggedUser();
        blogService.getAll().then(r => {
            this.setState({blogs: r});
        });
    }

    render() {

        const {blogs, modalNexBlogShow, modalLoginShow} = this.state;
        const {isLogged} = this.props;

        let waitingForLogin = false;

        let createBlog = () => {
            if (isLogged) {
                waitingForLogin = true;
                this.setState({modalNexBlogShow: true});
            } else {
                this.setState({modalLoginShow: true});
            }
        };

        return (
            <div style={{marginTop: '56px'}}>
                <Header/>
                <section className="p-5 text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">Publique sobre o que você adora, do seu jeito</h1>
                        <p className="lead text-muted">
                            Crie um blog lindo e exclusivo. É fácil e grátis.</p>
                        <p>
                            <a href="#" className="btn btn-warning my-2"
                               onClick={createBlog}>CRIAR SEU BLOG</a>
                        </p>
                    </div>
                </section>

                <div className="album py-5 bg-light">
                    <div className="container">
                        <div className="row">
                            {blogs.map((blog) => {
                                return (
                                    <BlogCard key={blog._id} blog={blog}/>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <NewBlog
                    show={modalNexBlogShow}
                    onHide={() => this.setState({modalNexBlogShow: false})}
                    closemodal={() => this.setState({modalNexBlogShow: false})}
                />
                <Login
                    show={modalLoginShow}
                    onHide={() => this.setState({modalLoginShow: false})}
                    closemodal={() => this.setState({modalLoginShow: false})}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
