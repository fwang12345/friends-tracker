import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
export default class Signup extends Component {
    constructor(props) {
        super(props)
        const { onSubmit } = props
        this.state = {
            username: '',
            password: '',
            verify: '',
            disabled: true
        }
        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
        this.onSubmit = onSubmit
    }

    /**
     * Updates state and checks if button should be enabled
     * @param {Event} e
     */
    change(e) {
        var placeholder = e.target.placeholder
        const { username, password, verify, _ } = this.state
        if (placeholder === 'username') {
            this.setState({ username: e.target.value, disabled: !e.target.value || !password || !verify})
        } else if (placeholder === 'password') {
            this.setState({ password: e.target.value, disabled: !e.target.value || !username || !verify })
        } else if (placeholder === 'verify password') {
            this.setState({ verify: e.target.value, disabled: !e.target.value || !username || !password })
        }
    }

    /**
     * Set state to default and call onSubmit function from prop
     * @param {Event} e
     */
    submit(e) {
        e.preventDefault()
        const { username, password, verify, _ } = this.state
        if (password === verify) {
            axios.get('http://localhost:5000/user/find/'+username).then(res => {
                if (res.data.length) {
                    alert('Username taken');
                } else {
                    axios.post('http://localhost:5000/user', {
                        username: username,
                        password: password
                    }).then(_ => this.props.history.push('/'))
                    .catch(err => console.log(err));
                }

            })
            .catch(err => console.log(err));
        } else {
            alert("Passwords do not match");
        }

    }

    render() {
        const { username, password, verify, disabled } = this.state
        return (
            <div className="container">
                <div className="d-flex justify-content-center h-100">
                    <div className="card">
                        <div className="card-header">
                            <h3>Sign Up</h3>
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
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>
                                    <input type="password" className="form-control" placeholder="verify password" onChange={this.change} value={verify}></input>
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Signup" className="btn float-right login_btn" disabled={disabled}></input>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-center links">
                                Already have an account?<Link to="/" className="nav-link">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}