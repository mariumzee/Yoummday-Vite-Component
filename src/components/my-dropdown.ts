import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface DropdownItem {
  label: string;
  value: string;
  group: string;
}

interface GroupedItems {
  [key: string]: DropdownItem[];
}

@customElement("my-dropdown")
export class MyDropdown extends LitElement {
  static styles = css`
    .dropdown {
      width: 200px;
      padding: 8px 16px;

      position: relative;
      display: inline-block;
    }
    .dropdown-button {
      background-color: #333;
      color: white;
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;
      min-width: 200px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid #ccc;
      cursor: pointer;
      border-radius: 5px;
    }
    .dropdown-menu {
      display: none;
      position: absolute;
      background-color: #333;
      min-width: 200px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
    .dropdown-menu.show {
      display: block;
    }
    .dropdown-menu.left {
      left: 0;
      right: auto;
    }
    .dropdown-menu.right {
      right: 0;
      left: auto;
    }
    .dropdown-item,
    .clear-button {
      color: white;
      padding: 8px 16px;
      font-size: 13px;
      text-decoration: none;
      display: block;
      cursor: pointer;
    }
    .dropdown-item:hover,
    .clear-button:hover {
      background-color: #555;
    }
    .dropdown-item.active {
      background-color: #462e8e;
    }
    .clear-button {
      background: none;
      border: none;
    }
    .dropdown-section {
      padding: 8px 0;
      border-top: 1px solid #555;
    }
    .guide-button {
      margin-left: 10px;
      padding: 2px 6px;
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
  `;

  @property({ type: Array })
  items: DropdownItem[] = [
    { label: "Yoummday", value: "1", group: "Standard" },
    { label: "Day 1", value: "2", group: "Standard" },
    { label: "AI Introduction", value: "3", group: "AI" },
    { label: "AI Advanced", value: "4", group: "AI" },
  ];

  @property({ type: String })
  buttonText = "Select an item";

  @property({ type: String, reflect: true })
  dropdownAlignment: "left" | "right" = "left";

  @state()
  private isOpen = false;

  @state()
  private selectedValue: string | null = null;

  private toggleDropdown = () => {
    this.isOpen = !this.isOpen;
  };

  private handleItemClick(value: string) {
    this.selectedValue = value;
    const selectedItem = this.items.find((item) => item.value === value);
    if (selectedItem) {
      this.buttonText = selectedItem.label;
      this.isOpen = false;
      this.dispatchEvent(
        new CustomEvent("item-selected", { detail: { value } })
      );
    }
  }

  private clearSelection = () => {
    this.isOpen = false;
    this.buttonText = "Select an item";
    this.selectedValue = null;

    this.dispatchEvent(new CustomEvent("item-cleared"));
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("click", this.handleWindowClick);
  }

  disconnectedCallback() {
    window.removeEventListener("click", this.handleWindowClick);
    super.disconnectedCallback();
  }

  private handleWindowClick = (event: MouseEvent) => {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.isOpen = false;
    }
  };

  render() {
    const groupedItems = this.items.reduce<GroupedItems>((acc, item) => {
      (acc[item.group] = acc[item.group] || []).push(item);
      return acc;
    }, {});

    return html`
      <div class="dropdown">
        <button class="dropdown-button" @click=${this.toggleDropdown}>
          <span style="flex-grow: 1;">${this.buttonText}</span>

          ${this.selectedValue
            ? html`<span
                class="clear-button guide-button"
                @click=${this.clearSelection}
              >
                X
              </span>`
            : html`<span class="guide-button">▼</span>`}
        </button>

        <div
          style="text-align: ${this.dropdownAlignment}"
          class="dropdown-menu ${this.isOpen ? "show" : ""} "
        >
          ${Object.keys(groupedItems).map(
            (group) => html`
              <div
                class="dropdown-section "
                style="text-align: ${this.dropdownAlignment}"
              >
                ${groupedItems[group].map(
                  (item) => html`
                    <div
                      class="dropdown-item ${this.selectedValue === item.value
                        ? "active"
                        : ""}"
                      @click=${() => this.handleItemClick(item.value)}
                    >
                      ${item.label}
                    </div>
                  `
                )}
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
