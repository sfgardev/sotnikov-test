import { PostWithAdditionalInfo } from "./Posts";

export type PostModel = {
  body: string;
  id: number;
  title: string;
  userId: number;
};

export type UserModel = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

type Geo = {
  lat: string;
  lng: string;
};

type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type CommentModel = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type PostEditState = Pick<
  PostWithAdditionalInfo,
  "id" | "username" | "title" | "body"
>;

export type PostEditModalState = Pick<
  PostWithAdditionalInfo,
  "id" | "username" | "title" | "body"
> & { show: boolean };

export type PostDeleteConfirmationModalState = {
  show: boolean;
  postId: number;
};

export type AddToFavoritesConfirmationModalState = {
  show: boolean;
};

export type AddNewPostModalState = Pick<
  PostWithAdditionalInfo,
  "username" | "title" | "body"
> & {
  show: boolean;
};
