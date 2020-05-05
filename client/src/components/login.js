import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props)
        const { onSubmit } = props
        this.state = {
            username: '',
            password: '',
            disabled: true,
            token: ''
        }
        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
        this.onSubmit = onSubmit
    }
    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            this.props.history.push('/home');
        }
    }

    /**
     * Updates state and checks if button should be enabled
     * @param {Event} e
     */
    change(e) {
        var type = e.target.type
        if (type === 'text') {
            this.setState({ username: e.target.value, disabled: !e.target.value || !this.state.password })
        } else if (type === 'password') {
            this.setState({ password: e.target.value, disabled: !e.target.value || !this.state.username })
        }
    }

    /**
     * Set state to default and call onSubmit function from prop
     * @param {Event} e
     */
    submit(e) {
        e.preventDefault()
        var username = this.state.username;
        var password = this.state.password;
        this.setState({ username: '', password: '', disabled: true })
        axios.post('http://localhost:5000/user/login', {
            username: username,
            password: password
        }).then(res => {
            if (res.data.success) {
                localStorage.setItem('token', res.data.username);
                console.log(localStorage.getItem('token'))
                this.props.history.push('/home')
            } else {
                alert(res.data.message)
            }
        }).catch(err => console.log(err));
    }

    render() {
        const { username, password, disabled } = this.state
        return (
            <div className="container">
                <div className="d-flex justify-content-center h-100">
                    <div className="card">
                        <div className="card-header">
                            <h3>Sign In</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.submit}>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="username" onChange={this.change} value={username}></input>
                                </div>

                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>
                                    <input type="password" className="form-control" placeholder="password" onChange={this.change} value={password}></input>
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Login" className="btn float-right login_btn" disabled={disabled}></input>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-center links">
                                Don't have an account?<Link to="/signup" className="nav-link">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}