import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Preferences } from "@capacitor/preferences";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export const STORAGE_KEY = "my-images";

// Handle click to add image
document.querySelector("#upload-box").addEventListener("click", async (e) => {
  // Capture image with Capacitor
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Base64,
    source: CameraSource.Prompt,
  });

  // Show the selected image
  const image = document.getElementById("image");
  image.src = `data:image/jpeg;base64,${photo.base64String}`;
  image.style.display = "block";

  // Hide the dialog upload-box
  document.getElementById("upload-box").style.display = "none";
});

// Handle click to safe image
document.getElementById("save").addEventListener("click", async (e) => {
  // Get the image data and input text
  const image = document.getElementById("image").getAttribute("src");
  const description = document.getElementById("description").value;

  // Load any stored previous data
  const { value } = await Preferences.get({ key: STORAGE_KEY });

  // Add the new image/description to the array
  // or create a new array
  // Then store the JSON.stringified() version to Preferences
  if (value) {
    const arr = JSON.parse(value);
    arr.push({
      image,
      description,
    });
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(arr) });
  } else {
    const arr = [
      {
        image,
        description,
      },
    ];
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(arr) });
  }

  // Reset image and textarea
  document.getElementById("image").style.display = "none";
  document.getElementById("description").value = "";

  // Show upload-box again
  document.getElementById("upload-box").style.display = "flex";

  // Make our list reload with a custom event
  const body = document.querySelector("body");
  body.dispatchEvent(new CustomEvent("reload-list"));

  // Indicate list update with haptic feedback
  await Haptics.impact({ style: ImpactStyle.Medium });
});
