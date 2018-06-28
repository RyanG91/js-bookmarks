import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Bookmark from './components/Bookmark'

class App extends Component {
  state = {
    bookmarks: [],
  }

  remove = (id) => { // id = Mongo _id of the bookmark
    const index = this.state.bookmarks.findIndex(bookmark => bookmark._id === id)
    if (index >= 0) {
      const bookmarks = [...this.state.bookmarks]
      bookmarks.splice(index, 1)
      this.setState({ bookmarks })
    }
  }

// LINE 21 - Key removes chrome error message, it will be a bit slower without it
  render() {
    const { bookmarks } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bookmarks</h1>
        </header>
        <ul>
          {
            bookmarks.map(
              bookmark => <Bookmark key={bookmark._id} {...bookmark} remove={this.remove} />
            )
          }
        </ul>
      </div>
    );
  }
  async componentDidMount() {
    try {
      const bookmarks = await axios.get(
        'http://localhost:3000/bookmarks'
      )
      this.setState({ bookmarks: bookmarks.data })
    }
    catch(error) {
      alert('Can\'t get bookmarks!')
    }
  }
}



export default App;
