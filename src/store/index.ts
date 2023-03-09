import { atom } from "jotai";
import { UserInfo } from "firebase/auth";

export const userAtom = atom<undefined | null | UserInfo>(undefined);
