export const STUDENT_DATA = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;
  let major = 'Kỹ thuật phần mềm';
  if (id % 3 === 0) major = 'Thiết kế đồ họa';
  else if (id % 3 === 1) major = 'An toàn thông tin';

  return {
    id: id.toString(),
    name: `Sinh viên FPT ${id}`,
    studentId: `SE${18000 + id}`,
    major: major,
    avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${id}`,
    status: id % 5 === 0 ? 'Vắng' : 'Đang học',
    gpa: (Math.random() * (4.0 - 2.0) + 2.0).toFixed(1), 
  };
});

export const SECTION_DATA = [
  {
    title: 'Kỹ Thuật Phần Mềm',
    data: STUDENT_DATA.filter(s => s.major === 'Kỹ thuật phần mềm'),
  },
  {
    title: 'An Toàn Thông Tin',
    data: STUDENT_DATA.filter(s => s.major === 'An toàn thông tin'),
  },
  {
    title: 'Thiết Kế Đồ Họa',
    data: STUDENT_DATA.filter(s => s.major === 'Thiết kế đồ họa'),
  },
];