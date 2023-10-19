import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchPosts, setSearchPosts] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        setPosts(response.data.slice(0, 10));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const addPost = () => {
    if (newPost.trim() === '') return;
    axios
      .post('https://jsonplaceholder.typicode.com/posts', {
        title: newPost,
        body: newPost,
        userId: 1,
      })
      .then((response) => {
        // Add the new post to the beginning of the posts array
        setPosts([response.data, ...posts]);
        setNewPost('');
      })
      .catch((error) => {
        console.error('Error adding post:', error);
      });
  };


  const deletePost = (postId) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== postId));
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  useEffect(() => {
    // Filter posts based on the search query
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchPosts.toLowerCase())
    );
    setFilteredPosts(filteredPosts); // Update the filteredPosts state
  }, [searchPosts, posts]);

  return (
    <div className="app-container">
      <h1>Posts</h1>
      <input
        type="text"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="New Post"
      />
      <button className="add-button" onClick={addPost}>Add Post</button>
      <input
        type="text"
        value={searchPosts}
        onChange={(e) => setSearchPosts(e.target.value)}
        placeholder="Search Posts"
      />
      {loading ? (
        <div className="loading-container">
          <div className="loading-message">Loading...</div>
        </div>
      ) : (
        <div>
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <p className="post-title">{post.title}</p>
              <div className="post-buttons">
                <button className="delete-button" onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
