import React, { Component } from 'react';
import Navbar from './navbar'
import axios from 'axios'
import url from '../Constants'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            friends: [],
            active: '',
            search: '',
            result: [],
            message: '',
            disabled: true,
            messages: []
        }
        this.active = this.active.bind(this);
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
        this.message = this.message.bind(this);
    }
    componentDidMount() {
        var element = document.getElementsByClassName("message")
        element[0].scrollTop = element[0].scrollHeight
        const token = localStorage.getItem('token')
        if (token) {
            axios.post(url.API_URL+'/user/find', {
                username: token
            }).then(user => {
                if (user.data.success) {
                    const arr = user.data.user.friends
                    this.setState({ friends: arr})
                    if (arr.length) {
                        this.setState({ active: arr[0] })
                        const token = localStorage.getItem('token')
                        axios.post(url.API_URL + '/message/get', {
                            from: token,
                            to: arr[0]
                        }).then(user => {
                            if (user.data.success) {
                                const results = user.data.results
                                this.setState({messages: results})
                            }
                        }).catch(err => console.log(err))
                    }
                }
            }).catch(err => console.log(err))
        } else {
            this.props.history.push('/');
        }
    }
    search(e) {
        const search = e.target.value
        this.setState({search:search})
        const {friends} = this.state
        if (search) {
            this.setState({results: friends.filter(x => x.includes(search))})
        }
    }
    active(e) {
        const active = e.target.id
        this.setState({active:active})
        const token = localStorage.getItem('token')
        axios.post(url.API_URL+'/message/get', {
            from: token,
            to: active
        }).then(user => {
            if (user.data.success) {
                const results = user.data.results
                this.setState({messages: results})
            }
        }).catch(err => console.log(err))
    }
    onChange(e) {
        const { active } = this.state
        this.setState({message: e.target.value, disabled: !e.target.value || !active})
    }
    message(e) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const { active, message } = this.state;
        axios.post(url.API_URL+'/message/add', {
            from: token,
            to: active,
            message: message
        }).then(user => {
            if (user.data.success) {
                this.setState({message: '', disabled: true});
            }
        }).catch(err => console.log(err))
    }
    render() {
        const { friends, active, search, results, message, disabled, messages} = this.state;
        const arr = search ? results : friends
        return (
            <div className="root">
                <Navbar history={this.props.history} />
                <div className="main-section">
		            <div className="head-section">
			            <div className="headLeft-section">
				            <div className="headLeft-sub">
					            <input type="text" name="search" placeholder="Search Friends" onChange={this.search} value={search}></input>
				            </div>
			            </div>
			            <div className="headRight-section">
					            <h3>{active}</h3>
				        </div>
		            </div>
		            <div className="body-section">
			            <div className="left-section overflow" data-mcs-theme="minimal-dark">
				            <ul>
                                {arr.map((user, i) =>
                                <div key={i} onClick={this.active} id={user}>
                                    {user === active && (
                                    <li className="active" id={user}>
                                        <div className="chatList" id={user}>
                                            <div className="desc" id={user}>
                                                {user}
                                            </div>
                                        </div>
                                    </li>)
                                    }
                                    {user !== active && (
                                    <li id={user}>
                                        <div className="chatList" id={user}>
                                            <div className="desc" id={user}>
                                                {user}
                                            </div>
                                        </div>
                                    </li>)
                                    }
                                </div> 
                                )}
                                
                            </ul>
                        </div>
                        <div className="right-section">
                            <div className="message overflow">
                                <ul>
                                {messages.map((message, i) =>
                                <div key={i}>
                                    {message.from === active && (
                                    <li className="msg-left">
                                        <div className="msg-desc">
                                            {message.message}
                                        </div>
                                    </li>)
                                    }
                                    {message.from !== active && (
                                    <li className="msg-right">
                                        <div className="msg-desc">
                                            {message.message}
                                        </div>
                                    </li>)
                                    }
                                </div> 
                                )}
                                </ul>
                            </div>
                            <div className="right-section-bottom">
                                <form onSubmit={this.message}>
                                    <input type="text" name="" placeholder="Type a message..." value = {message} onChange={this.onChange}></input>
                                    <button className="btn-send" disabled={disabled}><i className="fas fa-paper-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}