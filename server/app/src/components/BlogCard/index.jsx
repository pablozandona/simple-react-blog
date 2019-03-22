import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
moment.locale('pt-br')
import {Link} from "react-router-dom";
import './blogCard.scss';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class BlogCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {blog} = this.props;
        return (
            <div className="col-md-4">
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p className="card-title">{blog.title}</p>
                        <p className="card-text pt-2 pb-2">{blog.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                                <Link to={"/blog/" + blog._id}>
                                    <button type="button" className="btn btn-sm btn-outline-warning">Entrar</button>
                                </Link>
                            </div>
                            <OverlayTrigger overlay={<Tooltip>{moment(new Date(blog.lastUpdate)).format('DD/MM/YYYY HH:mm:ss')}</Tooltip>}>
                                <small className="text-muted">Último post: <b className="hour">{moment(new Date(blog.lastUpdate)).fromNow()}</b></small>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BlogCard);
