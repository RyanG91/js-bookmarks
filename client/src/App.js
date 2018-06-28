import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Bookmark from './components/Bookmark'

class App extends Component {
  state = {
    bookmarks: [],
    loading: true,
    newbookmark: '',
  }

  remove = (id) => { // id = Mongo _id of the bookmark
    const index = this.state.bookmarks.findIndex(bookmark => bookmark._id === id)
    if (index >= 0) {
      axios.delete(`http://localhost:3000/bookmarks/${id}`).then(() => {
        const bookmarks = [...this.state.bookmarks]
        bookmarks.splice(index, 1)
        this.setState({ bookmarks })
      })
    }
  }


  newBookmark = (e) => {
    e.preventDefault();
    const elements = e.target.elements
    axios.post('http://localhost:3000/bookmarks', { title: elements.title.value, url: elements.url.value })
    .then(bookmark => {
      this.setState({ newbookmark: '', bookmarks: [...this.state.bookmarks, bookmark.data] })
    })
  }

// LINE 21 - Key removes chrome error message, it will be a bit slower without it
  render() {
    const { bookmarks, loading } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bookmarks</h1>
        </header>
        { loading ? <p>Loading...</p>: (
          <ul>
            {
              bookmarks.map(
                bookmark => <Bookmark key={bookmark._id} {...bookmark} remove={this.remove} />
              )
            }
          </ul>
        )}

        <form onSubmit={this.newBookmark}>
          <h2>New Bookmark</h2>
          <label htmlFor="title">Title:</label>
          <input id="title" ></input>
          <label htmlFor="url">Url:</label>
          <input id="url" ></input>
          <button type="submit">Add Bookmark</button>
        </form>

      </div>
    );
  }
  async componentDidMount() {
    try {
      const bookmarks = await axios.get(
        'http://localhost:3000/bookmarks'
      )
      this.setState({ bookmarks: bookmarks.data, loading: false })
    }
     catch(error) {
      alert('Can\'t get bookmarks!')
    }
  }
}



export default App;
