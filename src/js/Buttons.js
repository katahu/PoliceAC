let userTime = localStorage.getItem("userTime") || "1000";
let autoTransition = JSON.parse(localStorage.getItem("autoTransition")) || false;
let direction = JSON.parse(localStorage.getItem("direction")) || false;

function createRippleEffect(elem) {
  let rippleContainer = elem.querySelector(".c-ripple");

  if (!rippleContainer) {
    rippleContainer = document.createElement("div");
    rippleContainer.classList.add("c-ripple");
    elem.appendChild(rippleContainer);
  }

  const drawRipple = (clientX, clientY) => {
    const ripple = document.createElement("div");
    ripple.classList.add("c-ripple__circle");
    const rect = elem.getBoundingClientRect();
    const diagonal = Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2));
    const size = diagonal * 2;
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    const parentStyle = window.getComputedStyle(elem);
    ripple.style.borderRadius = parentStyle.borderRadius;
    rippleContainer.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 700);
  };

  if (!elem._hasRippleListener) {
    elem.addEventListener("mousedown", (e) => {
      if (e.target.closest(".btn-menu-item")) return;
      if (e.button !== 0) return;
      drawRipple(e.clientX, e.clientY);
    });
    elem._hasRippleListener = true;
  }
}

class MenuController {
  constructor() {
    this.elements = new Set();
    window.addEventListener("resize", () => {
      this.closeAll();
    });
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove(e) {
    this.elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const { clientX, clientY } = e;
      const diffX = clientX >= rect.right ? clientX - rect.right : rect.left - clientX;
      const diffY = clientY >= rect.bottom ? clientY - rect.bottom : rect.top - clientY;
      if (diffX >= 30 || diffY >= 30) {
        this.close(element);
      }
    });
  }

  onClickOutside(e) {
    this.elements.forEach((element) => {
      if (!element.contains(e.target)) {
        this.close(element);
      }
    });
  }

  close(element) {
    if (!this.elements.has(element)) return;
    element.classList.remove("active");
    element.parentElement.classList.remove("menu-open");
    this.elements.delete(element);
    if (this.elements.size === 0) {
      document.removeEventListener("click", this.onClickOutside);
      window.removeEventListener("mousemove", this.onMouseMove);
    }
  }

  closeAll() {
    this.elements.forEach((element) => this.close(element));
  }

  openBtnMenu(element, onClose) {
    if (this.elements.has(element)) {
      this.close(element);
      return;
    }
    this.elements.add(element);
    element.classList.add("active");
    element.parentElement.classList.add("menu-open");
    if (onClose) {
      element.addEventListener("toggle", onClose, { once: true });
    }
    document.addEventListener("click", this.onClickOutside);
    window.addEventListener("mousemove", this.onMouseMove);
  }
}

const controller = new MenuController();

function ButtonMenu(option) {
  const { buttons, menuDirection } = option;
  const el = document.createElement("div");
  el.classList.add("btn-menu", menuDirection);
  el.append(...buttons.map(ButtonMenuItem));
  return el;
}

function ButtonToggle(option) {
  const { icon, className, text, rp, onClick, buttons, onClose, menuDirection } = option;
  const button = document.createElement("div");

  if (icon) {
    const iconElement = document.createElement("i");
    iconElement.classList.add(...icon.split(" "));
    button.append(iconElement);
  }
  if (className) {
    button.classList.add(className);
  }

  if (text) {
    const textElement = document.createElement("span");
    textElement.textContent = text;
    button.append(textElement);
  }

  if (rp) {
    createRippleEffect(button);
  }

  if (buttons && buttons.length > 0) {
    const menuElement = ButtonMenu({ buttons, menuDirection });
    button.append(menuElement);

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
      if (button.classList.contains("menu-open")) {
        controller.close();
      } else {
        controller.openBtnMenu(menuElement, onClose);
      }
    });

    button.addEventListener("mouseenter", () => {
      if (!button.classList.contains("menu-open")) {
        controller.openBtnMenu(menuElement, onClose);
      }
    });
  } else {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    });
  }

  return button;
}

function ButtonMenuItem(option) {
  const { icon, className, text, regularText, group, onClick } = option;
  const el = document.createElement("div");
  el.classList.add("btn-menu-item");
  if (className) {
    el.classList.add(className);
  }
  if (group) {
    el.setAttribute("data-group", group);
  }

  if (icon) {
    const iconElement = document.createElement("i");
    iconElement.classList.add("icon", ...icon.split(" "));
    if (group === "direction") {
      if (iconElement.classList.contains("fa-up")) {
        iconElement.classList.replace("fa-light", direction ? "fa-solid" : "fa-light");
      } else if (iconElement.classList.contains("fa-down")) {
        iconElement.classList.replace("fa-light", !direction ? "fa-solid" : "fa-light");
      }
    }
    if (group === "autoTransition") {
      iconElement.classList.replace("fa-light", autoTransition ? "fa-solid" : "fa-light");
    }
    el.prepend(iconElement);
  }
  if (text || regularText) {
    const textElement = document.createElement("span");
    textElement.classList.add("btn-menu-item-text");
    if (text) {
      textElement.textContent = text;
    }
    if (regularText) {
      textElement.innerHTML = regularText;
    }
    el.appendChild(textElement);
  }
  const inputElement = el.querySelector("input");
  if (inputElement) {
    inputElement.value = userTime;
    inputElement.addEventListener("input", (e) => {
      userTime = e.target.value;
      localStorage.setItem("userTime", userTime);
    });
  }
  if (onClick) {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleIcon(el, group);
      onClick(e);
    });
  }
  return el;
}

function toggleIcon(el, group) {
  const icon = el.querySelector("i");
  if (group === "autoTransition") {
    ["fa-light", "fa-solid"].forEach((className) => icon.classList.toggle(className));
  } else if (group === "direction") {
    const buttons = el.parentElement.querySelectorAll(`.btn-menu-item[data-group="direction"] i`);
    buttons.forEach((btnIcon) => {
      btnIcon.classList.remove("fa-solid");
      btnIcon.classList.add("fa-light");
    });
    icon.classList.remove("fa-light");
    icon.classList.add("fa-solid");
  }
}

const timeMenu = [
  {
    className: "no-scale",
    regularText: '<input type="text" placeholder="Время задержки (мс)" class="btn-menu-item-input">',
    onClick: () => {},
  },
];

const buttonTime = ButtonToggle({
  icon: "fa-light fa-clock",
  className: "btn-menu-toggle",
  rp: true,
  onClick: () => {},
  buttons: timeMenu,
  menuDirection: "bottom-left",
});

const directionMenu = [
  {
    icon: "fa-light fa-up",
    text: "Вверх",
    group: "direction",
    onClick: () => {
      direction = true;
      localStorage.setItem("direction", JSON.stringify(direction));
    },
  },
  {
    icon: "fa-light fa-down",
    text: "Вниз",
    group: "direction",
    onClick: () => {
      direction = false;
      localStorage.setItem("direction", JSON.stringify(direction));
    },
  },
  {
    icon: "fa-light fa-right-left",
    text: "Автопереход",
    group: "autoTransition",
    onClick: () => {
      autoTransition = !autoTransition;
      localStorage.setItem("autoTransition", JSON.stringify(autoTransition));
    },
  },
];

const buttonDirection = ButtonToggle({
  icon: "fa-light fa-gear",
  className: "btn-menu-toggle",
  rp: true,
  onClick: () => {},
  buttons: directionMenu,
  menuDirection: "bottom-right",
});

const buttonStart = ButtonToggle({
  icon: "fa-light fa-play icon",
  text: "Старт",
  className: "btn-clicker",
  rp: true,
  onClick: () => {
    start();
  },
});

const buttonStop = ButtonToggle({
  icon: "fa-light fa-pause icon",
  text: "Пауза",
  className: "btn-clicker",
  rp: true,
  onClick: () => {
    pause();
  },
});

function keydownHandler(event) {
  if (event.altKey && event.key === "1") {
    start();
  }
  if (event.altKey && event.key === "2") {
    pause();
  }
}

const menuPolice = document.createElement("div");
menuPolice.classList.add("menuPolice");

topNav.append(menuPolice);
menuPolice.append(buttonTime, buttonDirection, buttonStart, buttonStop);

function startMenu() {
  if (!versionPlugin) return;
  menuPolice.classList.add("active");
  document.addEventListener("keydown", keydownHandler);
  const search = document.querySelector('[data-bind="click: $root.newSearch"]');
  search.removeEventListener("click", reset);
  search.addEventListener("click", reset);
}

function stopMenu() {
  menuPolice.classList.remove("active");
  document.removeEventListener("keydown", keydownHandler);
}
