import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./my-dropdown.scss?inline";

interface DropdownItem {
  label: string;
  value: string;
}

@customElement("my-dropdown")
export class MyDropdown extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ attribute: "button-text" })
  accessor buttonText = "Dropdown";

  @property({ attribute: false })
  accessor items: DropdownItem[] = [];

  @property({ attribute: "alignment" })
  accessor alignment: "left" | "right" = "right";

  @property({ attribute: "active-item" })
  accessor activeItem = "";

  @state()
  private accessor isOpen = false;

  constructor() {
    super();
    this.initializeItems();
  }
  initializeItems() {
    this.items = [
      { label: "You", value: "1" },
      { label: "Made", value: "2" },
      { label: "My", value: "3" },
      { label: "Day!", value: "4" },
      { label: "Day 1", value: "5" },
      { label: "Day 2", value: "6" },
      { label: "Day 3", value: "7" },
      { label: "Day 4", value: "8" },
    ];
  }

  private handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.isOpen = false;
      this.requestUpdate();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleClickOutside);
  }

  private toggleDropdown(e: Event): void {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
    this.requestUpdate();

    requestAnimationFrame(() => {
      const dropdownMenu = this.shadowRoot!.querySelector(
        ".dropdown-menu"
      ) as HTMLElement;
      if (dropdownMenu) {
        if (this.isOpen) {
          dropdownMenu.style.display = "block";
          requestAnimationFrame(() => {
            dropdownMenu.classList.add("show");
          });
        } else {
          dropdownMenu.classList.remove("show");
          setTimeout(() => {
            dropdownMenu.style.display = "none";
          }, 300);
        }
      }
    });
  }

  private handleItemClick(value: string) {
    this.activeItem = value;
    this.dispatchEvent(
      new CustomEvent("item-selected", {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
    this.isOpen = true;
  }

  render() {
    return html`
      <button class="dropdown-button" @click=${this.toggleDropdown}>
        ${this.buttonText}
      </button>

      <div
        class="dropdown-menu ${this.isOpen ? "show" : ""} align-${this
          .alignment}"
      >
        ${this.items.map(
          (item, index) => html`
            <div
              class="dropdown-item ${item.value === this.activeItem
                ? "active"
                : ""}"
              @click=${() => this.handleItemClick(item.value)}
            >
              ${index + 1}) ${item.label}
            </div>
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-dropdown": MyDropdown;
  }
}
