import getAuthentic from "./user/getAuthentic";
import postAuthenticate from "./user/postAuthenticate";
import { postUser, putUser } from "./user/createUser";
import { updateUser } from "./user/updateUser";
import { getUser, getUsers, getAllUsers } from "./user/getUser";
import { deleteUser, deleteUsers, deleteAllUsers } from "./user/deleteUser";
import { putExhibit, postExhibit } from "./exhibit/createExhibit";
import { deleteExhibit, deleteExhibits, deleteAllExhibits } from "./exhibit/deleteExhibit";
import { getExhibit, getExhibits, getAllExhibits } from "./exhibit/getExhibit";
import { updateExhibit } from "./exhibit/updateExhibit";
import { postImage } from "./image/postImage";
import { deleteImage, deleteImages, deleteAllImages } from "./image/deleteImage";
import { getImage, getImages, getAllImages } from "./image/getImage";

/**
 * An object containing all API functions for the client to interact with
 * exhibits.
 */
const exhibit = {
  put: putExhibit,
  post: postExhibit,
  deleteOne: deleteExhibit,
  deleteMany: deleteExhibits,
  deleteAll: deleteAllExhibits,
  getOne: getExhibit,
  getMany: getExhibits,
  getAll: getAllExhibits,
  updateOne: updateExhibit,
}

/**
 * An object containing all API functions for the client to interact with
 * images on the server.
 */
const image = {
  post: postImage,
  deleteOne: deleteImage,
  deleteMany: deleteImages,
  deleteAll: deleteAllImages,
  getOne: getImage,
  getMany: getImages,
  getAll: getAllImages,
}

/**
 * An object containing all API functions for the client to interact with
 * users on the server.
 */
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
  updateOne: updateUser
}

/**
 * An object containing all API functions for the client to interact with
 * the server.
 */
const api = {
  exhibit,
  image,
  user    
};

export default api;