
import { ObjectId } from "mongodb";
import { db } from "./mongodb";

export const deleteFile = async (fileId:string) => {
  if (!fileId) return;
  await db.collection("files").deleteOne({ _id: ObjectId(fileId) });
};

export const deleteFolder = async (folderId) => {
  if (!folderId) return;
  await db.collection("folders").deleteOne({ _id: ObjectId(folderId) });
};

export const findUser = async (userId) => {
  const response = await db.collection("users").findOne({ _id: ObjectId(userId) });
  return response;
};

export const getCollaboratingWorkspaces = async (userId) => {
  if (!userId) return [];
  const collaboratedWorkspaces = await db.collection("workspaces").aggregate([
    {
      $lookup: {
        from: "collaborators",
        localField: "_id",
        foreignField: "workspaceId",
        as: "collaborators",
      },
    },
    { $match: { "collaborators.userId": ObjectId(userId) } },
    {
      $project: {
        id: 1,
        createdAt: 1,
        workspaceOwner: 1,
        title: 1,
        iconId: 1,
        data: 1,
        inTrash: 1,
        logo: 1,
        bannerUrl: 1,
      },
    },
  ]).toArray();
  return collaboratedWorkspaces;
};

export const getFolders = async (workspaceId) => {
  const results = await db.collection("folders")
    .find({ workspaceId: ObjectId(workspaceId) })
    .sort({ createdAt: 1 })
    .toArray();
  return { data: results, error: null };
};

export const getActiveProductsWithPrice = async () => {
  try {
    const res = await db.collection("products").aggregate([
      { $match: { active: true } },
      {
        $lookup: {
          from: "prices",
          localField: "_id",
          foreignField: "productId",
          as: "prices",
        },
      },
    ]).toArray();
    return { data: res, error: null };
  } catch (error) {
    console.log("error at get active products:", error);
    return { data: [], error };
  }
};

export const getPrivateWorkspaces = async (userId) => {
  if (!userId) return [];
  const privateWorkspaces = await db.collection("workspaces").aggregate([
    {
      $lookup: {
        from: "collaborators",
        localField: "_id",
        foreignField: "workspaceId",
        as: "collaborators",
      },
    },
    {
      $match: {
        "collaborators": { $size: 0 },
        "workspaceOwner": ObjectId(userId)
      },
    },
    {
      $project: {
        id: 1,
        createdAt: 1,
        workspaceOwner: 1,
        title: 1,
        iconId: 1,
        data: 1,
        inTrash: 1,
        logo: 1,
        bannerUrl: 1,
      },
    },
  ]).toArray();
  return privateWorkspaces;
};

export const getSharedWorkspaces = async (userId) => {
  if (!userId) return [];
  const sharedWorkspaces = await db.collection("workspaces").aggregate([
    {
      $lookup: {
        from: "collaborators",
        localField: "_id",
        foreignField: "workspaceId",
        as: "collaborators",
      },
    },
    {
      $match: { "workspaceOwner": ObjectId(userId) },
    },
    {
      $project: {
        id: 1,
        createdAt: 1,
        workspaceOwner: 1,
        title: 1,
        iconId: 1,
        data: 1,
        inTrash: 1,
        logo: 1,
        bannerUrl: 1,
      },
    },
  ]).toArray();
  return sharedWorkspaces;
};

export const getUsersFromSearch = async (email) => {
  if (!email) return [];
  const accounts = await db.collection("users")
    .find({ email: { $regex: `^${email}`, $options: "i" } })
    .toArray();
  return accounts;
};

export const createFile = async (file) => {
  try {
    await db.collection("files").insertOne(file);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
