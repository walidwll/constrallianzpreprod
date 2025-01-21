'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, addUser, selectUser } from '@/lib/store/features/userSlice';

export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  // Example function to add a new user
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: 'New User',
      email: 'newuser@example.com'
    };
    dispatch(addUser(newUser));
  };

  // Example function to select a user
  const handleSelectUser = (user) => {
    dispatch(selectUser(user));
  };

  return (
    <div>
      <button onClick={handleAddUser}>Add New User</button>
      
      <div>
        <h2>User List:</h2>
        {users.map(user => (
          <div 
            key={user.id} 
            onClick={() => handleSelectUser(user)}
            style={{ cursor: 'pointer' }}
          >
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div>
          <h2>Selected User:</h2>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email}</p>
        </div>
      )}
    </div>
  );
}