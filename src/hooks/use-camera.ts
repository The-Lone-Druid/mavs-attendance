export function useCamera() {
  const takeSelfie = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);

      stream.getTracks().forEach((track) => track.stop());

      return canvas.toDataURL("image/jpeg");
    } catch (error) {
      console.error("Error accessing camera:", error);
      return null;
    }
  };

  return { takeSelfie };
}
