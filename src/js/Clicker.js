let arrTable = [];
let initial = false;
let currentIndex = 0;
let isPaused = false;
let isRunning = false;

function Initial() {
  if (initial) return;
  initial = true;
  const table = document.querySelectorAll(
    'table[data-bind="foreach: currentTrades"] tr'
  );
  if (table.length === 0) {
    initial = false;
    return;
  }
  table.forEach((row, index) => {
    arrTable.push({ row, index });
  });
  if (direction) {
    currentIndex = arrTable.length - 1;
  } else {
    currentIndex = 0;
  }
}

async function Clicker() {
  if (isRunning) {
    return;
  }
  isRunning = true;
  isPaused = false;
  Initial();

  if (direction) {
    for (let i = currentIndex; i >= 0; i--) {
      while (isPaused) {
        await new Promise((resolve) => setTimeout(resolve));
      }
      if (i !== currentIndex) await observeSingleMutation();
      await new Promise((resolve) => setTimeout(resolve, userTime));
      if (isPaused) break;
      arrTable[i].row.click();
      currentIndex = i;

      if (i === 0) {
        reset();
      }
    }
    if (currentIndex < 0) reset();
  } else {
    for (let i = currentIndex; i < arrTable.length; i++) {
      while (isPaused) {
        await new Promise((resolve) => setTimeout(resolve));
      }
      if (i !== currentIndex) await observeSingleMutation();
      await new Promise((resolve) => setTimeout(resolve, userTime));
      if (isPaused) break;
      arrTable[i].row.click();
      currentIndex = i;

      if (i === arrTable.length - 1) {
        reset();
      }
    }
  }
  isRunning = false;
}

function pauseClicker() {
  isPaused = true;
}

function reset() {
  currentIndex = direction ? arrTable.length - 1 : 0;
  arrTable = [];
  initial = false;
  isRunning = false;
  if (!autoTransition) return;
  paginationList();
}

async function observeSingleMutation() {
  const targetNode = document.querySelector('[data-bind="with: currentStuff"]');
  if (!targetNode) return;

  return new Promise((resolve) => {
    const config = { childList: true, subtree: true };
    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          observer.disconnect();
          resolve();
          break;
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  });
}

function paginationList() {
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  const activePage = pagination.querySelector(".active");
  if (!activePage) return;

  let targetPage;
  if (direction) {
    targetPage = activePage.previousElementSibling;
  } else {
    targetPage = activePage.nextElementSibling;
  }

  if (targetPage) {
    const targetLink = targetPage.querySelector("a");
    if (targetLink) {
      targetLink.click();
      resetPaginaion();
    }
  }
  function resetPaginaion() {
    arrTable = [];
    initial = false;
  }
}
