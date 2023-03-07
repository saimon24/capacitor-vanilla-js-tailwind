import { Preferences } from "@capacitor/preferences";
import { STORAGE_KEY } from "./main";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

// Define our custom element
window.customElements.define(
  "my-photos",
  class extends HTMLElement {
    constructor() {
      super();

      const root = this.attachShadow({ mode: "open" });

      // Basic HTML
      root.innerHTML = `
      <div part="list" id="list">
        <h2>Stored Photos</h2>
       <div id="delete-button" part="btn">Delete Photos</div>
      </div>
    `;
    }

    // Called ons tart
    async connectedCallback() {
      const self = this;
      this.createList();

      // Listen to our reload event
      const body = document.querySelector("body");
      body.addEventListener("reload-list", (event) => {
        this.removeItems();
        this.createList();
      });

      // Listen to the delete button event
      const deleteBtn = self.shadowRoot.getElementById("delete-button");
      deleteBtn.addEventListener("click", async () => {
        await Preferences.remove({ key: STORAGE_KEY });
        this.removeItems();
      });
    }

    // Remove all DOM items of the list
    removeItems() {
      const self = this;
      const items = self.shadowRoot.querySelectorAll("#items");
      if (items) {
        for (let i of items) {
          i.remove();
        }
      }
      // Give a haptic feedback inside the native app!
      Haptics.impact({ style: ImpactStyle.Heavy });
    }

    // Create DOM items for every stored image
    async createList() {
      const self = this;
      const { value } = await Preferences.get({ key: STORAGE_KEY });

      if (value) {
        const arr = JSON.parse(value);
        const list = self.shadowRoot.getElementById("list");

        arr.map((item) => {
          const el = document.createElement("div");
          el.onclick = () => this.shouldShare(item);
          el.setAttribute("part", "item");
          el.id = "items";
          el.setAttribute("class", "list-item");
          const img = document.createElement("img");
          img.src = item.image;
          img.setAttribute("part", "image");

          el.innerHTML = `<div">${item.description}</div>`;
          el.appendChild(img);

          list.appendChild(el);
        });
      }
    }

    // Share an image using the Share plugin
    // Write the base64 string to the Filesystem
    // so we can share the URI!
    shouldShare = async (item) => {
      const fileName = `${new Date().getTime()}.png`;

      await Filesystem.writeFile({
        path: fileName,
        data: item.image,
        directory: Directory.Cache,
      });
      const uriResult = await Filesystem.getUri({
        directory: Directory.Cache,
        path: fileName,
      });

      await Share.share({
        title: "Share this",
        text: item.description,
        url: uriResult.uri,
        dialogTitle: "Share your image",
      });
    };
  }
);
