import axios from "axios";
import { serverUrl } from '../App.jsx'



export const getComments = async (reelId) => {
  const res = await axios.get(`${serverUrl}/api/user/comments/${reelId}` , { withCredentials: true });
  return res.data;
};

export const postComment = async (reelId, text) => {
  const res = await axios.post(`${serverUrl}/api/user/comments`, { reelId, text },{ withCredentials: true });
  console.log(res)
  return res.data;
};

export const deleteComment = async (commentId) => {
  await axios.delete(`${serverUrl}/api/user/comments/${commentId}`,{ withCredentials: true });
};