import { useEffect, useState } from 'react';
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


const PHOTO_STORAGE = 'photos';
export function usePhotoGallery() {

  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    const loadSaved = async () => {
      const { value } = await Storage.get({key: PHOTO_STORAGE});
      const photosInStorage = (value ? JSON.parse(value) : []) as UserPhoto[];

      for (let photo of photosInStorage) {
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
      setPhotos(photosInStorage);
    };
    loadSaved();
  },[]);

  const savePicture = async (photo: Photo, filename: string):Promise<UserPhoto> => {
    let base64Data: string;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }
    const savedFile = await Filesystem.writeFile({
      data: base64Data,
      directory: Directory.Data,
      path: filename
    });

    if (isPlatform('hybrid')){
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      }
    } else {
      return {
        filepath: filename,
        webviewPath: photo.webPath,
      };
    }
  };

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    
    const filename = new Date().getTime() + '.jpeg';
    const newPhoto = await savePicture(photo, filename);
    const newPhotos = [
      newPhoto,
      ...photos
    ];
    setPhotos(newPhotos);
    Storage.set({key: PHOTO_STORAGE, value: JSON.stringify(newPhotos)});
  }

  

  return {
    photos,
    takePhoto
  };
};

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string');
      }
    };
    reader.readAsDataURL(blob);
  });
}