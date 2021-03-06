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
            messages: [],
            change: true,
            limit: 50,            
        }
        this.active = this.active.bind(this);
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
        this.message = this.message.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.scroll = this.scroll.bind(this)
    }
    scroll(e) {
        var element = document.getElementsByClassName("message")
        if (element[0].scrollTop === 0) {
            const { active, limit } = this.state;
            const token = localStorage.getItem('token')
            axios.post(url.API_URL + '/message/get', {
                from: token,
                to: active,
                limit: limit + 50,
            }).then(user => {
                if (user.data.success) {
                    const results = user.data.results
                    this.setState({ messages: results , limit: Math.max(results.length, limit)})
                }
            }).catch(err => console.log(err))
        }
    }
    componentDidUpdate() {
        const {change} = this.state
        if (change) {
            var element = document.getElementsByClassName("message")
            element[0].scrollTop = element[0].scrollHeight
            this.setState({change: false})
        }
        
    }
    getMessages() {
        const { active, limit } = this.state;
        const token = localStorage.getItem('token')
        axios.post(url.API_URL + '/message/get', {
            from: token,
            to: active,
            limit: limit,
        }).then(user => {
            if (user.data.success) {
                const results = user.data.results
                if (this.state.messages.length === results.length) {
                    this.setState({ messages: results})
                } else {
                    this.setState({ messages: results, change: true})
                }
            }
        }).catch(err => console.log(err))
    }
    componentDidMount() {
        setInterval(this.getMessages, 2000);
        var element = document.getElementsByClassName("message")
        element[0].scrollTop = element[0].scrollHeight
        const token = localStorage.getItem('token')
        const { limit } = this.state
        if (token) {
            axios.post(url.API_URL + '/user/find', {
                username: token
            }).then(user => {
                if (user.data.success) {
                    const arr = user.data.user.friends
                    if (arr.length) {
                        const token = localStorage.getItem('token')
                        axios.post(url.API_URL + '/message/get', {
                            from: token,
                            to: arr[0],
                            limit: limit
                        }).then(user => {
                            if (user.data.success) {
                                const results = user.data.results
                                this.setState({ friends: arr, active: arr[0], messages: results })
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
        var search = e.target.value
        this.setState({ search: search })
        const { friends } = this.state
        if (search) {
            search = search.toLowerCase()
            this.setState({ results: friends.filter(x => x.toLowerCase().includes(search)) })
        }
    }
    active(e) {
        const active = e.target.id
        const token = localStorage.getItem('token')
        const { limit } = this.state
        axios.post(url.API_URL + '/message/get', {
            from: token,
            to: active,
            time: limit
        }).then(user => {
            if (user.data.success) {
                const results = user.data.results
                this.setState({ active: active, messages: results , change: this.state.active !== active})
            }
        }).catch(err => console.log(err))
    }
    onChange(e) {
        const { active } = this.state
        this.setState({ message: e.target.value, disabled: !e.target.value || !active })
    }
    message(e) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const { active, message, messages } = this.state;
        axios.post(url.API_URL + '/message/add', {
            from: token,
            to: active,
            message: message
        }).then(user => {
            if (user.data.success) {
                messages.unshift({ from: token, message: message })
                this.setState({ message: '', disabled: true , change: true});
            }
        }).catch(err => console.log(err))
    }
    render() {
        const { friends, active, search, results, message, disabled, messages } = this.state;
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
                            <div className="message overflow" onScroll={this.scroll}>
                                <ul>
                                    {messages.reduceRight((acc, message, i) => acc.concat(
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
                                        </div>)
                                    , [])}
                                </ul>
                            </div>
                            <div className="right-section-bottom">
                                <form onSubmit={this.message}>
                                    <input type="text" name="" placeholder="Type a message..." value={message} onChange={this.onChange}></input>
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