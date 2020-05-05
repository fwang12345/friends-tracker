import React, { Component } from 'react';

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      disabled: true,
    }
    this.change = this.change.bind(this)
    this.logout = this.logout.bind(this)
    this.search = this.search.bind(this)
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/');
    }
  }
  search(e) {
    const {username} = this.state;
    localStorage.setItem('search', username);
    this.setState({username: '', disabled: true})
    this.props.history.push('/search')
  }
  /**
     * Updates state and checks if button should be enabled
     * @param {Event} e
     */
  change(e) {
    this.setState({ username: e.target.value, disabled: !e.target.value})
  }

  /**
   * Set state to default and call onSubmit function from prop
   * @param {Event} e
   */
  logout(e) {
    e.preventDefault()
    localStorage.removeItem('token')
    this.props.history.push('/')
  }

  render() {
    const {username, disabled} = this.state;
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
          <div className="input-group-text prepend">
            <span><i className="fas fa-user-friends"></i></span>
          </div>
          <form className="form-inline" onSubmit={this.search}>
            <input className="form-control mr-sm-2" type="search" placeholder="Search Users" onChange={this.change} value={username}></input>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" disabled={disabled}>Search</button>
          </form>
        </div>
        <div className="mx-auto order-0">
          <a className="navbar-brand mx-auto" href="\home"><span className="input-group-text"><i className="fas fa-home"></i></span></a>
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <div className="btn btn-dark my-2 my-sm-0"><a className="nav-link" href = "\requests">Requests</a></div>
            </li>
            <li className="nav-item">
              <button className="btn btn-dark my-2 my-sm-0" type="submit" onClick={this.logout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}