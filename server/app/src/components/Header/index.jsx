import React from 'react';
import {connect} from 'react-redux';
import {Button, ButtonToolbar} from "react-bootstrap";
import Login from "../Login";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {modalShow: false};
    }

    render() {
        let modalClose = () => this.setState({modalShow: false});
        const {isLogged, user} = this.props;

        return (
            <nav>
                <div className="navbar navbar-dark bg-warning shadow-sm fixed-top">
                    <div className="container d-flex justify-content-between">
                        <a href="/" className="navbar-brand d-flex align-items-center text-dark">
                            <strong>Bolologs</strong>
                        </a>

                        {!isLogged ? (
                            <Button
                                variant="outline-light btn-outline-dark"
                                onClick={() => this.setState({modalShow: true})}
                            >
                                Entrar
                            </Button>
                        ) : (
                            <div className="text-secondary">
                                Olá <strong className="mr-3 text-dark">{user.name}</strong>
                                <Button variant="outline-light btn-outline-dark"
                                        onClick={() => this.props.logout()}
                                >
                                    Sair
                                </Button>
                            </div>
                        )}
                        <Login
                            show={this.state.modalShow}
                            onHide={modalClose}
                            closemodal={() => this.setState({modalShow: false})}
                        />
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    isLogged: state.home.isLogged,
    user: state.home.user,
});

const mapDispatchToProps = dispatch => ({
    logout: logout => dispatch({type: 'LOGOUT'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
