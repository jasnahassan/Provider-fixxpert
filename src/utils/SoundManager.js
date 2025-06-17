import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let soundInstance = null;

export const playNotificationSound = () => {
  if (soundInstance) {
    soundInstance.stop(() => {
      soundInstance.release();
    });
  }

  soundInstance = new Sound('notificationsound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('🔇 Sound load error:', error);
      return;
    }
    soundInstance.play(() => {
      soundInstance.release();
      soundInstance = null;
    });
  });
};

export const stopNotificationSound = () => {
  if (soundInstance) {
    soundInstance.stop(() => {
      soundInstance.release();
      soundInstance = null;
    });
  }
};
