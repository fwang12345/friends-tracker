import React, { Component } from 'react';
import Navbar from './navbar'
import axios from 'axios'
import url from '../Constants'

export default class Dep extends Component {
    constructor(props) {
        super(props)
        this.state = {
            friends: []
        }
    }
    componentDidMount() {
        const token = localStorage.getItem('token')
        if (token) {
            axios.post(url.API_URL+'/user/find', {
                username: token
            }).then(user => {
                if (user.data.success) {
                    this.setState({ friends: user.data.user.friends})
                }
            }).catch(err => console.log(err))
        } else {
            this.props.history.push('/');
        }
    }

    render() {
        const { friends } = this.state
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
                            {friends.map((user, i) =>
                                <tr key={i} >
                                    <td>{user}
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