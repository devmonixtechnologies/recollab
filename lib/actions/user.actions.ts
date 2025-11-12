'use server';

import { connectToDatabase } from "../db";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import UserModel from "../models/User";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const getUsersByEmails = async ({ emails }: { emails: string[] }) => {
  try {
    if (!emails.length) return [];

    await connectToDatabase();

    const normalizedEmails = emails.map(normalizeEmail);
    const users = await UserModel.find({ email: { $in: normalizedEmails } }).lean();

    const userMap = new Map(
      users.map((user: any) => [user.email.toLowerCase(), {
        id: user._id.toString(),
        name: user.name ?? user.email,
        email: user.email,
        avatar: user.avatarUrl ?? '/assets/icons/avatar-placeholder.svg',
        color: user.color ?? undefined,
      }])
    );

    const sortedUsers = normalizedEmails.map((email) => userMap.get(email) ?? null);

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return [];
  }
}

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter((email) => normalizeEmail(email) !== normalizeEmail(currentUser));

    if(text.length) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText))

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    console.log(`Error fetching document users: ${error}`);
    return [];
  }
}