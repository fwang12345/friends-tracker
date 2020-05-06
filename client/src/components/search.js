import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './navbar'
import url from '../Constants'
export default class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: {}
        }
        this.request = this.request.bind(this)
    }
    componentDidMount() {
        const username = localStorage.getItem('search')
        const token = localStorage.getItem('token')
        if (token && username) {
            localStorage.removeItem('search')
            axios.post(url.API_URL+'/user/search', {
                username: username,
                token: token
            }).then(res => {
                if (res.data.success) {
                    axios.post(url.API_URL+'/user/find', {
                        username: token
                    }).then(user => {
                        var requests = user.data.user.requests;
                        var friends = user.data.user.friends;
                        var users = {}
                        var arr = res.data.users
                        for (var i = 0; i < arr.length; i++) {
                            users[arr[i].username] = arr[i].requests.includes(token) || 
                            requests.includes(arr[i].username) || friends.includes(arr[i].username);
                        }
                        this.setState({ users: users })
                    }).catch(err => console.log(err))
                }
            }).catch(err => console.log(err))
        } else {
            this.props.history.push('/')
        }
    }

    /**
     * Send requests
     * @param {Event} e
     */
    request(e) {
        const username = e.target.id;
        const token = localStorage.getItem('token')
        axios.post(url.API_URL+'/user/request', {
            username: username,
            token: token
        }).then(res => {
            if (res.data.success) {
                var {users} = this.state;
                users[username] = true;
                this.setState({users: users})
            }
        }).catch(err => console.log(err))
    }

    render() {
        const { users } = this.state
        const arr = Object.keys(users)
        return (
            <div className="root">
                <Navbar history={this.props.history}/>
                <div className="container scroll">
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arr.map((user, i) => 
                            <tr key = {i} >
                                <td>{user}
                                    {!users[user] &&
                                        (<span className="float-right">
                                            <button className="btn btn-secondary" id = {user} onClick={this.request}>
                                                <i className="fas fa-user-plus" id = {user}></i>
                                            </button>
                                        </span>)
                                    }
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