import React from 'react';
import './newpost.scss';
import {Alert, Modal} from "react-bootstrap";
import {blogService} from "../../services";
import {withRouter} from "react-router-dom";
import Button from "react-bootstrap/Button";

const state = {
    title: '',
    sections: [],
    content: '',
    formSubmitted: false,
    error: false,
};

class NewPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...state};
        this.handleSectionChange = this.handleSectionChange.bind(this);
        this.handleSubSectionChange = this.handleSubSectionChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    reset() {
        state.sections = [];
        this.setState({...state});
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSectionChange(e, index) {
        const {name, value} = e.target;
        let sections = this.state.sections.slice();
        const section = sections[index];
        section[name] = value;
        this.setState({sections});
    }

    handleSubSectionChange(e, index, subIndex) {
        const {name, value} = e.target;
        let sections = this.state.sections.slice();
        const subSection = sections[index].subSections[subIndex];
        subSection[name] = value;
        this.setState({sections});
    }

    submitSuccess() {
        this.reset();
        this.props.closemodal();
    }

    submit(e) {
        e.preventDefault();

        this.setState({formSubmitted: true});

        const {sections, title, content} = this.state;
        const {blog} = this.props;

        let errorSection = false;

        for (const s of sections) {
            if (!s.title || !s.content) {
                errorSection = true;
            }
            for (const sub in sections.subSections) {
                if (!sub.title || !sub.content) {
                    errorSection = true;
                }
            }
        }

        if (!title || !content || errorSection) return;

        blogService.createPost({title, content, blog: blog, sections})
            .then(r => {
                this.submitSuccess(r);
            }, e => {
                this.setState({error: true});
            });
    }

    render() {

        const {title, content, sections, formSubmitted, error} = this.state;

        const newSection = () => {
            sections.push({
                title: '',
                content: '',
                subSections: []
            });
            this.setState({sections});
        };

        const newSubSection = (section) => {
            section.subSections.push({
                title: '',
                content: ''
            });
            this.setState({sections});
        };

        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-login"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-login">
                        Novo Post
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row align-items-center justify-content-center">
                        <div className="col m-5">
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
                                    className={'form-group' + (formSubmitted && !content ? ' has-error' : '')}>
                                    <textarea className="form-control" name="content"
                                              value={content}
                                              onChange={this.handleChange} placeholder="Conteúdo"/>
                                    {formSubmitted && !content &&
                                    <div className="help-block">Campo obrigatório.</div>
                                    }
                                </div>
                                {sections.map((section, index) => {
                                    return (
                                        <div key={index} className="ml-5 mb-2 section">
                                            <h6>Sessão {index + 1}</h6>
                                            <div
                                                className={'form-group' + (formSubmitted && !section.title ? ' has-error' : '')}>
                                                <input type="text" className="form-control" name="title"
                                                       value={section.title}
                                                       onChange={e => this.handleSectionChange(e, index)}
                                                       placeholder="Título"/>
                                                {formSubmitted && !section.title &&
                                                <div className="help-block">Campo obrigatório.</div>
                                                }
                                            </div>
                                            <div
                                                className={'form-group' + (formSubmitted && !section.content ? ' has-error' : '')}>
                                                <textarea className="form-control" name="content"
                                                          value={section.content}
                                                          onChange={e => this.handleSectionChange(e, index)}
                                                          placeholder="Conteúdo"/>
                                                {formSubmitted && !section.content &&
                                                <div className="help-block">Campo obrigatório.</div>
                                                }
                                            </div>
                                            {section.subSections.map((subsection, indexSub) => {
                                                return (
                                                    <div key={'s' + index + indexSub} className="mb-2 ml-5 section">
                                                        <h6>Subsessão {indexSub + 1}</h6>
                                                        <div
                                                            className={'form-group' + (formSubmitted && !subsection.title ? ' has-error' : '')}>
                                                            <input type="text" className="form-control" name="title"
                                                                   value={subsection.title}
                                                                   onChange={e => this.handleSubSectionChange(e, index, indexSub)}
                                                                   placeholder="Título"/>
                                                            {formSubmitted && !subsection.title &&
                                                            <div className="help-block">Campo obrigatório.</div>
                                                            }
                                                        </div>
                                                        <div
                                                            className={'form-group' + (formSubmitted && !subsection.content ? ' has-error' : '')}>
                                                            <textarea className="form-control" name="content"
                                                                      value={subsection.content}
                                                                      onChange={e => this.handleSubSectionChange(e, index, indexSub)}
                                                                      placeholder="Conteúdo"/>
                                                            {formSubmitted && !subsection.content &&
                                                            <div className="help-block">Campo obrigatório.</div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <Button onClick={() => newSubSection(section)} variant="light">Aicionar
                                                subsessão</Button>
                                        </div>
                                    )
                                })}
                                <Button onClick={newSection} variant="light">Aicionar sessão</Button>
                                <button className="btn btn-lg btn-warning mt-5 float-md-right" type="submit">Postar
                                </button>
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

export default withRouter(NewPost);
