import { BASE_API_URL } from "./config";

export const deletePost = async (id: number) => {
  try {
    const res = await fetch(`${BASE_API_URL}/posts/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Something went wrong with deleting post");

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};
