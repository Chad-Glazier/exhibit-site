import getAuthentic from "./user/getAuthentic";
import postAuthenticate from "./user/postAuthenticate";
import { postUser, putUser } from "./user/createUser";
import { getUser, getUsers, getAllUsers } from "./user/getUser";
import { deleteUser, deleteUsers, deleteAllUsers } from "./user/deleteUser";
import { putExhibit, postExhibit } from "./exhibit/createExhibit";
import { deleteExhibit, deleteExhibits, deleteAllExhibits } from "./exhibit/deleteExhibit";
import { getExhibit, getExhibits, getAllExhibits } from "./exhibit/getExhibit";
import { postImage } from "./image/postImage";
import { deleteImage, deleteImages, deleteAllImages } from "./image/deleteImage";
import { getImage, getImages, getAllImages } from "./image/getImage";

const exhibit = {
  put: putExhibit,
  post: postExhibit,
  deleteOne: deleteExhibit,
  deleteMany: deleteExhibits,
  deleteAll: deleteAllExhibits,
  getOne: getExhibit,
  getMany: getExhibits,
  getAll: getAllExhibits,
}

const image = {
  post: postImage,
  deleteOne: deleteImage,
  deleteMany: deleteImages,
  deleteAll: deleteAllImages,
  getOne: getImage,
  getMany: getImages,
  getAll: getAllImages,
}

const user = {
  authentic: getAuthentic,
  authenticate: postAuthenticate,
  post: postUser,
  put: putUser,
  getOne: getUser,
  getMany: getUsers,
  getAll: getAllUsers,
  deleteOne: deleteUser,
  deleteMany: deleteUsers,
  deleteAll: deleteAllUsers,
}

const api = {
  exhibit,
  image,
  user    
};

export default api;