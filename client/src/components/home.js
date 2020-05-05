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
            result: []
        }
        this.active = this.active.bind(this);
        this.search = this.search.bind(this);
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
                        this.setState({active: arr[0]})
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
        this.setState({active:e.target.id})
    }
    render() {
        const { friends, active, search, results} = this.state;
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
                                    <li className="msg-left">
                                        <div className="msg-left-sub">
                                            <div className="msg-desc">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua.
                                            </div>
                                        </div>
                                    </li>
                                    <li className="msg-right">
                                        <div className="msg-left-sub">
                                            <div className="msg-desc">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua.
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="right-section-bottom">
                                <form>
                                    <input type="text" name="" placeholder="Type a message..."></input>
                                    <button className="btn-send"><i className="fas fa-paper-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}