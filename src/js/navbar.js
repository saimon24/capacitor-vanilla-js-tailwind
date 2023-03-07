// A simple reusable custom navigation ba element with 3 slots
window.customElements.define(
  "custom-navbar",
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: var(--nav-bg);
        position: fixed;
        width: 100%;
        top: env(safe-area-inset-top);
      }
      .nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      ::slotted(h1) {
        margin: 0;
        font-size: 1em;
        font-weight: 700;
        color: #fff;
      }
      ::slotted(div) {
        color: #fff;
        margin: 0;
      }
    </style>
    <div class="nav">
      <div><slot name="start"></slot></div>
      <div><slot name="title"></slot></div>
      <div><slot name="end"></slot></div>
    </div>
    `;
    }
  }
);
