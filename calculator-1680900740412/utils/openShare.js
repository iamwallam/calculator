import * as Sharing from 'expo-sharing';

const openShare = url => {
  const options = {
    mimeType: 'text/plain',
    UTI: 'public.url',
  };

  return Sharing.shareAsync(url, options);
};

export default openShare;
