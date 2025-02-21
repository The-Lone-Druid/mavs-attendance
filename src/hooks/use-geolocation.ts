export function useGeolocation() {
  const getLocation = () => {
    return new Promise<GeolocationCoordinates>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("Please allow location access to check in/out"));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(
                new Error(
                  "Location information is unavailable. Please try again"
                )
              );
              break;
            case error.TIMEOUT:
              reject(new Error("Location request timed out. Please try again"));
              break;
            default:
              reject(new Error("An unknown error occurred getting location"));
          }
        },
        options
      );
    });
  };

  return { getLocation };
}
