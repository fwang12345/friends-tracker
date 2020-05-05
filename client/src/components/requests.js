import React, { Component } from 'react';
import Navbar from './navbar'
import axios from 'axios'
import url from '../Constants'
export default class Requests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requests: []
        }
        this.accept = this.accept.bind(this)
        this.reject = this.reject.bind(this)
    }
    componentDidMount() {
        const token = localStorage.getItem('token')
        if (token) {
            axios.post(url.API_URL+'/user/find', {
                username: token
            }).then(user => {
                if (user.data.success) {
                    this.setState({ requests: user.data.user.requests})
                }
            }).catch(err => console.log(err))
        } else {
            this.props.history.push('/');
        }
    }
    /**
     * Accept requests
     * @param {Event} e
     */
    accept(e) {
        const username = e.target.id;
        const token = localStorage.getItem('token')
        axios.post(url.API_URL+'/user/accept', {
            username: username,
            token: token
        }).then(res => {
            if (res.data.success) {
                var { requests } = this.state;
                const index = requests.indexOf(username);
                if (index > -1) {
                    requests.splice(index, 1);
                }
                this.setState({requests: requests})
            }
        }).catch(err => console.log(err))
    }
    /**
     * Reject requests
     * @param {Event} e
     */
    reject(e) {
        const username = e.target.id;
        const token = localStorage.getItem('token')
        axios.post(url.API_URL+'/user/reject', {
            username: username,
            token: token
        }).then(res => {
            if (res.data.success) {
                var { requests } = this.state;
                const index = requests.indexOf(username);
                if (index > -1) {
                    requests.splice(index, 1);
                }
                this.setState({requests: requests})
            }
        }).catch(err => console.log(err))
    }
    render() {
        const { requests } = this.state
        return (
            <div className="root">
                <Navbar history={this.props.history} />
                <div className="container">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((user, i) =>
                                <tr key={i} >
                                    <td>{user}
                                        <span className="float-right">
                                            <button className="btn btn-primary" id={user} onClick={this.accept}>
                                                Confirm
                                        </button>
                                            <button className="btn btn-secondary" id={user} onClick={this.reject}>
                                                <i className="fas fa-times" id={user}></i>
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}