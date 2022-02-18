import { 
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonIcon,
  IonFabButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet
} from '@ionic/react';
import { camera, trash, close } from 'ionicons/icons'
import { usePhotoGallery } from '../hooks/usePhotoGallery';

import './Tab2.css';

const Tab2: React.FC = () => {

  const { takePhoto } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonFab vertical="bottom" horizontal="center" slot="fixed" style={{marginBottom:'5%'}}>
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera} />
          </IonFabButton>
            
          
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
