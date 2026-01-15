//create a function that gets user details from local storage
export const getUserDetails = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};


