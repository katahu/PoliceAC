const wrapper = document.createElement("div");
wrapper.classList.add("wrapper-event");
const animateEvent = document.createElement("div");
animateEvent.classList.add("animate-event");
const topNav = document.getElementById("topNav");
wrapper.append(animateEvent);
topNav.prepend(wrapper);

let iconCount = null;
let iconClasess = [];
let iconColor = [];
let iconName = [];

async function fetchEventData() {
  try {
    const response = await fetch("https://59c87fe2c473d859.mokky.dev/events");
    const data = await response.json();
    if (!data.length || !data[0].active) return;
    iconCount = data[0].maxEvent;
    iconClasess = data[0].iconClasses;
    iconColor = data[0].iconColors;
    iconName = data[0].iconNames;
    createIcons();
  } catch (error) {
    console.error(error);
  }
}

class Icon {
  static iconPool = new Set();

  constructor(animateEvent, iconClasess, iconName, iconColors) {
    this.animateEvent = animateEvent;
    this.iconClasess = iconClasess;
    this.iconName = iconName;
    this.iconColors = iconColors;
  }

  createIcon() {
    const icon = document.createElement("i");
    const randomClass =
      this.iconClasess[Math.floor(Math.random() * this.iconClasess.length)];
    const randomName =
      this.iconName[Math.floor(Math.random() * this.iconName.length)];
    const randomColor =
      this.iconColors[Math.floor(Math.random() * this.iconColors.length)];
    icon.classList.add(randomClass, randomName, "event-icon");
    icon.style.color = randomColor;
    this.setPosition(icon);
    Icon.iconPool.add(icon);
    return icon;
  }

  setPosition(icon) {
    const randomX = Math.floor(Math.random() * 100);
    const randomOffset = Math.random() * 200 - 100;
    icon.style.setProperty("--start-position", `${randomX}%`);
    icon.style.setProperty("--x-offset", `${randomOffset}px`);
  }
}

function createIcons() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < iconCount; i++) {
    const icon = new Icon(
      animateEvent,
      iconClasess,
      iconName,
      iconColor
    ).createIcon();
    icon.style.setProperty("--animation-delay", `${Math.random() * 5}s`);
    fragment.appendChild(icon);
  }
  animateEvent.appendChild(fragment);
  requestAnimationFrame(() => {
    Icon.iconPool.forEach((icon) => icon.classList.add("animate"));
  });
}

fetchEventData();
