import React from 'react';
import {connect} from 'react-redux';
import './login.scss';
import {Alert, Modal} from "react-bootstrap";
import {userService} from "../../services";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.reset();

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);
        this.loginSubmit = this.loginSubmit.bind(this);
        this.registerSubmit = this.registerSubmit.bind(this);
    }

    reset() {
        this.state = {
            loginForm: {
                user: '',
                password: ''
            },
            registerForm: {
                user: '',
                password: '',
                name: '',
            },
            loginFormSubmitted: false,
            registerFormSubmitted: false,
            errorLogin: false,
            errorRegister: false
        };
    }

    handleChangeLogin(e) {
        const {name, value} = e.target;
        const loginForm = {...this.state.loginForm};
        loginForm[name] = value;
        this.setState({loginForm});
    }

    handleChangeRegister(e) {
        const {name, value} = e.target;
        this.setState({registerForm: {...this.state.registerForm, [name]: value}});
    }

    saveUser(r) {

    }

    loginSuccess(r) {
        this.saveUser(r);
        this.reset();
        this.props.closemodal();
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('token', JSON.stringify(r.token));
        this.props.loginSuccess(r.user);
    }

    loginSubmit(e) {
        e.preventDefault();

        this.setState({loginFormSubmitted: true});
        const {loginForm} = this.state;

        if (!loginForm.password || !loginForm.user) return;

        userService.login(loginForm)
            .then(r => {
                this.loginSuccess(r);
            }, e => {
                this.setState({errorLogin: true});
            });
    }

    registerSubmit(e) {

        e.preventDefault();

        this.setState({registerFormSubmitted: true});
        const {registerForm} = this.state;
        const {loginSuccess} = this.props;

        if (!registerForm.name || !registerForm.password || !registerForm.user) return;

        userService.register(registerForm)
            .then(r => {
                this.loginSuccess(r);
            }, e => {
                this.setState({errorRegister: true});
            });
    }

    render() {

        const {loginForm, registerForm, loginFormSubmitted, registerFormSubmitted, errorLogin, errorRegister} = this.state;

        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-login"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-login">
                        Entrar
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row align-items-center justify-content-center">
                        <div className="m-5">
                            <form name="form" onSubmit={this.loginSubmit}>
                                <h1 className="h3 mb-3 font-weight-normal">Entrar</h1>
                                <div
                                    className={'form-group' + (loginFormSubmitted && !loginForm.user ? ' has-error' : '')}>
                                    <input type="text" className="form-control" name="user"
                                           value={loginForm.user}
                                           onChange={this.handleChangeLogin} placeholder="Usuário"/>
                                    {loginFormSubmitted && !loginForm.user &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <div
                                    className={'form-group' + (loginFormSubmitted && !loginForm.password ? ' has-error' : '')}>
                                    <input type="password" className="form-control" name="password"
                                           value={loginForm.password}
                                           onChange={this.handleChangeLogin} placeholder="Senha"/>
                                    {loginFormSubmitted && !loginForm.password &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <button className="btn btn-lg btn-warning btn-block" type="submit">Entrar</button>
                            </form>
                            {loginFormSubmitted && errorLogin &&
                            <Alert variant="danger" className="mt-3">
                                Usuário ou senha inválida!
                            </Alert>
                            }
                        </div>
                        <div className="m-5">
                            <form name="formRegister" onSubmit={this.registerSubmit}>
                                <h1 className="h3 mb-3 font-weight-normal">Ainda não possui cadastro?</h1>

                                <div
                                    className={'form-group' + (registerFormSubmitted && !registerForm.name ? ' has-error' : '')}>
                                    <input type="text" className="form-control" name="name" value={registerForm.name}
                                           onChange={this.handleChangeRegister} placeholder="Nome"/>
                                    {registerFormSubmitted && !registerForm.name &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <div
                                    className={'form-group' + (registerFormSubmitted && !registerForm.user ? ' has-error' : '')}>
                                    <input type="text" className="form-control" name="user"
                                           value={registerForm.user}
                                           onChange={this.handleChangeRegister} placeholder="Usuário"/>
                                    {registerFormSubmitted && !registerForm.user &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <div
                                    className={'form-group' + (registerFormSubmitted && !registerForm.password ? ' has-error' : '')}>
                                    <input type="password" className="form-control" name="password"
                                           value={registerForm.password}
                                           onChange={this.handleChangeRegister} placeholder="Senha"/>
                                    {registerFormSubmitted && !registerForm.password &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <button className="btn btn-lg btn-warning btn-block" type="submit">Registrar</button>
                            </form>
                            {registerFormSubmitted && errorRegister &&
                            <Alert variant="danger" className="mt-3">
                                Esse usuário já está cadastrado, por favor escolha outro!
                            </Alert>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    user: state.home.user,
});

const mapDispatchToProps = dispatch => ({
    loginSuccess: user => dispatch({type: 'LOGIN_SUCCESS', user}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
