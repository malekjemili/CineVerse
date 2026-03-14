import axios from 'axios'

// Dev: Vite proxy → localhost:3000
// Prod (Vercel): VITE_API_URL = https://your-gateway.up.railway.app
const BASE = import.meta.env.VITE_API_URL || ''

const userAPI = axios.create({ baseURL: `${BASE}/api/users` })
const postAPI = axios.create({ baseURL: `${BASE}/api/posts` })

const attach = cfg => {
  const t = localStorage.getItem('cv_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
}
userAPI.interceptors.request.use(attach)
postAPI.interceptors.request.use(attach)

export const userService = {
  register:      d  => userAPI.post('/register', d),
  login:         d  => userAPI.post('/login', d),
  getProfile:    id => userAPI.get(`/profile/${id}`),
  updateProfile: d  => userAPI.put('/profile', d),
  follow:        id => userAPI.post(`/follow/${id}`),
  unfollow:      id => userAPI.delete(`/follow/${id}`),
}

export const postService = {
  getFeed:      (p=1)     => postAPI.get(`/feed?page=${p}&limit=10`),
  getUserPosts: (uid,p=1) => postAPI.get(`/user/${uid}?page=${p}&limit=10`),
  getPost:      id        => postAPI.get(`/${id}`),
  createPost:   fd        => postAPI.post('/', fd, { headers: { 'Content-Type': 'multipart/form-data' }}),
  updatePost:   (id,d)    => postAPI.put(`/${id}`, d),
  deletePost:   id        => postAPI.delete(`/${id}`),
  likePost:     id        => postAPI.post(`/${id}/like`),
  unlikePost:   id        => postAPI.delete(`/${id}/like`),
  getComments:  id        => postAPI.get(`/${id}/comments`),
  addComment:   (id,c)    => postAPI.post(`/${id}/comments`, { content: c }),
  deleteComment:(pid,cid) => postAPI.delete(`/${pid}/comments/${cid}`),
}

// Convert stored image path → full URL
export const imgUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  // image[] stores paths like /uploads/posters/xxx.jpg
  return `${BASE}/api/posts${path}`
}

// Time ago helper
export const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${Math.floor(s/60)}min`
  if (s < 86400)return `${Math.floor(s/3600)}h`
  if (s < 604800)return`${Math.floor(s/86400)}j`
  return new Date(date).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })
}

export const GENRES = [
  { value:'film',         label:'Film',         emoji:'🎬', color:'#c0392b' },
  { value:'serie',        label:'Série',         emoji:'📺', color:'#2e6da4' },
  { value:'anime',        label:'Animé',         emoji:'⛩️', color:'#8e44ad' },
  { value:'documentaire', label:'Documentaire',  emoji:'🌍', color:'#27ae60' },
]
