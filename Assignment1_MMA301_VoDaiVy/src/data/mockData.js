// src/data/mockData.js

export const ROOMS = [
  {
    id: '1',
    name: 'Lab 412',
    type: 'LAB', // Class, Lab, Research
    building: 'Alpha',
    capacity: 30,
    equipment: 'PC High Spec, Projector, AC',
    status: 'AVAILABLE', // AVAILABLE, BOOKED, MAINTENANCE
    image: 'https://img.freepik.com/free-photo/empty-computer-room-university_1008-62.jpg', // Ảnh placeholder đẹp
  },
  {
    id: '2',
    name: 'SDC G201',
    type: 'CLASS',
    building: 'Gamma',
    capacity: 40,
    equipment: 'Projector, Mic, Whiteboard',
    status: 'AVAILABLE',
    image: 'https://img.freepik.com/free-photo/empty-classroom-university-hall_1008-36.jpg',
  },
  {
    id: '3',
    name: 'Research Room Beta',
    type: 'RESEARCH',
    building: 'Beta',
    capacity: 10,
    equipment: 'Books, Quiet Zone, WiFi 6',
    status: 'MAINTENANCE', // Để test logic không cho đặt phòng bảo trì
    image: 'https://img.freepik.com/free-photo/library-with-books_1008-54.jpg',
  },
  // Thêm 1 phòng nữa để test scroll
  {
    id: '4',
    name: 'Lab 305',
    type: 'LAB',
    building: 'Alpha',
    capacity: 25,
    equipment: 'Mac Studio, Soundproof',
    status: 'AVAILABLE',
    image: 'https://img.freepik.com/free-photo/modern-office-space-with-desktops_1008-72.jpg',
  },
];