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

export function usePhotoGallery() {

  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    
    const filename = new Date().getTime() + '.jpeg';
    const newPhotos = [
      {
        filepath: filename,
        webviewPath: photo.webPath
      },
      ...photos
    ];
    setPhotos(newPhotos);
  }

  return {
    photos,
    takePhoto
  };
};