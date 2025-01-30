import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./my-dropdown.scss?inline";

@customElement("my-dropdown")
export class MyDropdown extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: Array })
  items: string[] = [];

  @property({ type: String })
  label = "Select an option";

  @state()
  private isOpen = false;

  @state()
  private selectedItem: string | null = null;

  private toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  private selectItem(item: string) {
    this.selectedItem = item;
    this.isOpen = false;
    this.dispatchEvent(
      new CustomEvent("selection-changed", {
        detail: { selectedItem: item },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="dropdown">
        <button class="dropdown-button" @click="${this.toggleDropdown}">
          ${this.selectedItem || this.label}
        </button>
        <div class="dropdown-content ${this.isOpen ? "show" : ""}">
          ${this.items.map(
            (item) => html`
              <div
                class="dropdown-item"
                @click="${() => this.selectItem(item)}"
              >
                ${item}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-dropdown": MyDropdown;
  }
}
