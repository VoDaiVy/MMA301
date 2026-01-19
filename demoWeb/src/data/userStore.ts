export const USER_DATABASE = [
  { 
    email: 'admin@fpt.edu.vn', 
    password: '123456', 
    name: 'Admin User', 
    phone: '0905123456', 
    major: 'Software Engineering' 
  }
];

export let currentUser: any = null;

export const addUser = (email, password) => {
  USER_DATABASE.push({ 
    email, 
    password, 
    name: 'Sinh viên mới', 
    phone: '', 
    major: 'Software Engineering' 
  });
};

export const loginUser = (email, password) => {
  const user = USER_DATABASE.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user; 
    return true;
  }
  return false;
};

export const updateProfile = (newData: { name: string, phone: string, major: string }) => {
  if (currentUser) {
    currentUser.name = newData.name;
    currentUser.phone = newData.phone;
    currentUser.major = newData.major;

    const index = USER_DATABASE.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
      USER_DATABASE[index] = { ...USER_DATABASE[index], ...newData };
    }
  }
};

export const logoutUser = () => {
  currentUser = null;
};