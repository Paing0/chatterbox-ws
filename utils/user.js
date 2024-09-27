export const users = [];

export const saveUser = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);
  return user;
};
export const getDisconnectUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUsersInRoom = (room) => {
  return users.filter((users) => (users.room = room));
};
