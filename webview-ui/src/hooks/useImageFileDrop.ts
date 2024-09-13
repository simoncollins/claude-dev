import { useEffect } from 'react';

const useImageFileDrop = (ref: React.RefObject<HTMLElement>, onDropImages: (base64Strings: string[]) => void) => {
  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      console.log('dropped');
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        const readers = imageFiles.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readers).then(onDropImages).catch(console.error);
      }
    };

    const handleDragOver = (event: DragEvent) => {
      console.log('dragging');
      event.preventDefault();
    };

    // const element = ref.current;
    if (window) {
        console.log('adding event listeners');
        window.addEventListener('drop', handleDrop);
        window.addEventListener('dragover', handleDragOver);
    }

    return () => {
      if (window) {
        console.log('removing event listeners');
        window.removeEventListener('drop', handleDrop);
        window.removeEventListener('dragover', handleDragOver);
      }
    };
  }, [ref, onDropImages]);
};

export default useImageFileDrop;