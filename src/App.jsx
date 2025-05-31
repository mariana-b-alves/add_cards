import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input state
  const [newUserData, setNewUserData] = useState({
    picture: '',
    fullName: '',
    email: '',
    location: ''
  });

  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=30')
      .then(res => res.json())
      .then(data => {
        setUsers(data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  const handleAddUser = () => {
    const [firstName, lastName = ''] = newUserData.fullName.split(' ');
    const [city, country = ''] = newUserData.location.split(',');

    const user = {
      picture: { large: newUserData.picture },
      name: { first: firstName || '', last: lastName || '' },
      email: newUserData.email,
      location: { city: city?.trim() || '', country: country?.trim() || '' }
    };

    if (edit) {
      setUsers(prevUsers =>
        prevUsers.map((u, i) => (i === editIndex ? user : u))
      );
      setEdit(false);
      setEditIndex(null);
    } else {
      // Add new user
      setUsers(prevUsers => [...prevUsers, user]);
    }

    setNewUserData({
      picture: '',
      fullName: '',
      email: '',
      location: ''
    });
  };

  const handleDeleteUser = (deleteIndex) => {
    setUsers(prevUsers => prevUsers.filter((_, index) => index !== deleteIndex));
    if (edit && editIndex === deleteIndex) {
      setEdit(false);
      setEditIndex(null);
    }
  };

  const handleEditUser = (user, index) => {
    setNewUserData({
      picture: user.picture.large,
      fullName: `${user.name.first} ${user.name.last}`,
      email: user.email,
      location: `${user.location.city}, ${user.location.country}`
    });
    setEdit(true);
    setEditIndex(index);
  };

  return (
    <>
      <h1>Users</h1>
      <hr />

      <section className='newUser'>
        <h1>New User Info</h1>
        <article className='inputs'>
          <input
            type="text"
            placeholder="Add the link of your image"
            value={newUserData.picture}
            onChange={e => setNewUserData({ ...newUserData, picture: e.target.value })}
          />
          <input
            type="text"
            placeholder="Add your name and surname"
            value={newUserData.fullName}
            onChange={e => setNewUserData({ ...newUserData, fullName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Add your email"
            value={newUserData.email}
            onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Add the city and country you're in"
            value={newUserData.location}
            onChange={e => setNewUserData({ ...newUserData, location: e.target.value })}
          />

          <button onClick={handleAddUser}>
            {edit ? 'UPDATE' : 'ADD'}
          </button>
        </article>
      </section>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid">
          {users.map((user, i) => (
            <section className="card" key={i}>
              <article>
                <img src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} />
                <h1>{user.name.first} {user.name.last}</h1>
                <h2>{user.email}</h2>
                <p>{user.location.city}, {user.location.country}</p>
              </article>
              <button onClick={() => handleDeleteUser(i)}>DELETE</button>
              <button onClick={() => handleEditUser(user, i)}>EDIT</button>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
