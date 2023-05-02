import getAuthentic from "./user/getAuthentic";
import postAuthenticate from "./user/postAuthenticate";
import { postUser } from "./user/postUser";
import { getUser, getUsers, getAllUsers } from "./user/getUser";
import { deleteUser, deleteUsers, deleteAllUsers } from "./user/deleteUser";

import { putExhibit, postExhibit } from "./exhibit/createExhibit";
import { deleteExhibit, deleteExhibits, deleteAllExhibits } from "./exhibit/deleteExhibit";
import { getExhibit, getExhibits, getAllExhibits } from "./exhibit/getExhibit";

import { postImage } from "./image/postImage";
import { deleteImage, deleteImages, deleteAllImages } from "./image/deleteImage";
import { getImage, getImages, getAllImages } from "./image/getImage";

namespace ApiClient {
  export namespace Exhibit {
    export const put = putExhibit;
    export const post = postExhibit;
    export const deleteOne = deleteExhibit;
    export const deleteMany = deleteExhibits;
    export const deleteAll = deleteAllExhibits;
    export const getOne = getExhibit;
    export const getMany = getExhibits;
    export const getAll = getAllExhibits;
  }

  export namespace Image {
    export const post = postImage
    export const deleteOne = deleteImage;
    export const deleteMany = deleteImages;
    export const deleteAll = deleteAllImages;
    export const getOne = getImage;
    export const getMany = getImages;
    export const getAll = getAllImages;
  }

  export namespace User {
    export const authentic = getAuthentic;
    export const authenticate = postAuthenticate;
    export const post = postUser;
    export const getOne = getUser;
    export const getMany = getUsers;
    export const getAll = getAllUsers;
    export const deleteOne = deleteUser;
    export const deleteMany = deleteUsers;
    export const deleteAll = deleteAllUsers;
  }
}

export default ApiClient;
