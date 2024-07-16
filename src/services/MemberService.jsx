import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999/api/members';

const getAllMembers = () => {
  return axios.get(API_BASE_URL);
};

const searchMembers = (params) => {
  return axios.get(`${API_BASE_URL}/admin/search`, { params });
};

const updateMember = (member) => {
  return axios.put(`${API_BASE_URL}/admin/update`, member);
};

const deleteMember = (memberId) => {
  return axios.delete(`${API_BASE_URL}/admin/${memberId}`);
};

const MemberService = {
  getAllMembers,
  searchMembers,
  updateMember,
  deleteMember,
};

export default MemberService;
