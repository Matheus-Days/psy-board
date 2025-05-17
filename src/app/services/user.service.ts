import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { updateDoc } from 'firebase/firestore';
import { lastValueFrom } from 'rxjs';

type CloudinaryUploadResponse = {
  url: string;
};

export type LoginResult = {
  registerCompleted: boolean;
  user: User;
  userData?: DocumentData | null;
};

export type UserFormData = {
  crpId: string;
  name: string;
  address: string;
  psycologicalSpecialty: string;
  phone: string;
  instagramAddress: string;
  targetAudience: string;
  serviceModality: string[];
  paymentMethod: string[];
  acceptedInsurances: string;
  picture: File;
};

export type UserPublicData = Omit<UserFormData, 'picture'> & {
  picture: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  afAuth = inject(Auth);
  firestore = inject(Firestore);
  storage = inject(Storage);
  http = inject(HttpClient);

  userData: DocumentData | undefined;

  constructor() {
    this.afAuth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        try {
          const userDocRef = this.fetchUserDocRef(user.uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            this.userData = docSnapshot.data();
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
    });
  }

  async checkAuthenticated(): Promise<User | undefined> {
    return new Promise((resolve) => {
      const unsubscribe = this.afAuth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user || undefined);
      });
    });
  }

  async checkRegistered(): Promise<UserPublicData | undefined> {
    if (this.userData) return this.userData as UserPublicData;
    
    const user = await this.checkAuthenticated();
    if (!user?.uid) {
      return undefined;
    }

    try {
      const userData = await this.fetchUserPublicData(user.uid);
      return userData;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return undefined;
    }
  }

  fetchUserDocRef(uid: string): DocumentReference<DocumentData> {
    const aCollection = collection(this.firestore, 'users');
    return doc(aCollection, uid);
  }

  async fetchUserPublicData(uid: string): Promise<UserPublicData> {
    const userDocRef = this.fetchUserDocRef(uid);
    const docSnapshot = await getDoc(userDocRef);
    const snapshotData = docSnapshot.data();
    if (!snapshotData) throw new Error('Usuário não cadastrado.');
    return snapshotData as UserPublicData;
  }

  async listUsers(): Promise<UserPublicData[]> {
    try {
      const response = await lastValueFrom(this.http.get<UserPublicData[]>('/api/users'));
      return response;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  }

  async loginWithGoogle(): Promise<LoginResult> {
    this.afAuth.setPersistence(browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.afAuth, provider);
    const user = result.user;

    if (!user) throw new Error('Login com Google falhou.');

    const userDocRef = this.fetchUserDocRef(user.uid);
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      return { registerCompleted: false, user };
    } else {
      this.userData = docSnapshot.data();
      return { registerCompleted: true, user, userData: this.userData };
    }
  }

  async logoutWithGoogle(): Promise<void> {
    await signOut(this.afAuth);
    this.userData = undefined;
  }

  async registerUser(uid: string, userFormData: UserFormData): Promise<DocumentData> {
    const userDocRef = this.fetchUserDocRef(uid);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) throw new Error('Usuário já cadastrado.');

    await setDoc(userDocRef, {
      uid,
      crpId: userFormData.crpId,
      name: userFormData.name,
      address: userFormData.address,
      psycologicalSpecialty: userFormData.psycologicalSpecialty,
      phone: userFormData.phone,
      instagramAddress: userFormData.instagramAddress,
      targetAudience: userFormData.targetAudience,
      serviceModality: userFormData.serviceModality,
      paymentMethod: userFormData.paymentMethod,
      acceptedInsurances: userFormData.acceptedInsurances,
    });

    const uploadResponse = await this.uploadProfilePic(userFormData.picture);

    await updateDoc(userDocRef, {
      picture: uploadResponse.url,
    });

    this.userData = this.fetchUserPublicData(uid);
    if (!this.userData) throw new Error('Erro ao cadastrar usuário.');
    return this.userData;
  }

  async unregisterUser(uid: string): Promise<void> {
    const userDocRef = this.fetchUserDocRef(uid);
    await deleteDoc(userDocRef);
    this.logoutWithGoogle();
  }

  async updateUserData(uid: string, userFormData: Partial<UserFormData>): Promise<void> {
    const userDocRef = this.fetchUserDocRef(uid);
    const data: Record<string, any> = { ...userFormData };

    if ('picture' in userFormData && userFormData.picture) {
      const uploadResponse = await this.uploadProfilePic(userFormData.picture);
      data['picture'] = uploadResponse.url;
    }

    await updateDoc(userDocRef, data);
    this.userData = await this.fetchUserPublicData(uid);
  }

  async uploadProfilePic(file: File): Promise<CloudinaryUploadResponse> {
    const form = new FormData();
    form.append('file', file);
    return lastValueFrom(
      this.http.post<CloudinaryUploadResponse>('/api/upload', form)
    );
  }
}
