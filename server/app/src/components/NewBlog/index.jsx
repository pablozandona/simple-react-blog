import React from 'react';
import './login.scss';
import {Alert, Modal} from "react-bootstrap";
import {blogService, userService} from "../../services";
import {withRouter} from "react-router-dom";

class NewBlog extends React.Component {
    constructor(props) {
        super(props);

        this.reset();

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    reset() {
        this.state = {
            title: '',
            description: '',
            formSubmitted: false,
            error: false,
        };
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    submitSuccess(r) {
        this.reset();
        // history.push('/blog/' + r._id);
        this.props.history.push('/blog/' + r._id)
    }

    submit(e) {
        e.preventDefault();

        this.setState({formSubmitted: true});

        const {title, description} = this.state;

        if (!title || !description) return;

        blogService.create({ title, description })
            .then(r => {
                this.submitSuccess(r);
            }, e => {
                this.setState({error: true});
            });
    }

    render() {

        const {title, description, formSubmitted, error} = this.state;

        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-login"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-login">
                        Criar Blog
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row align-items-center justify-content-center">
                        <div className="m-5">
                            <form name="form" onSubmit={this.submit}>
                                <div
                                    className={'form-group' + (formSubmitted && !title ? ' has-error' : '')}>
                                    <input type="text" className="form-control" name="title"
                                           value={title}
                                           onChange={this.handleChange} placeholder="Título"/>
                                    {formSubmitted && !title &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <div
                                    className={'form-group' + (formSubmitted && !description ? ' has-error' : '')}>
                                    <textarea className="form-control" name="description"
                                           value={description}
                                           onChange={this.handleChange} placeholder="Descrição"/>
                                    {formSubmitted && !description &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                <button className="btn btn-lg btn-warning btn-block" type="submit">Criar</button>
                            </form>
                            {formSubmitted && error &&
                            <Alert variant="danger" className="mt-3">
                               Esse blog já existe!
                            </Alert>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

// const mapStateToProps = state => ({
//     user: state.home.user,
// });
//
// const mapDispatchToProps = dispatch => ({
//     loginSuccess: user => dispatch({type: 'LOGIN_SUCCESS', user}),
// });

export default withRouter(NewBlog);
