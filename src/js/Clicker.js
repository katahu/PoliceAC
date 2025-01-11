let isActive = false;
let isPaused = false;
let isInitial = false;
let rowsCache = null;
let currentIndex = null;

function initializeRows() {
  if (!isInitial || !rowsCache) {
    const rows = document.querySelectorAll('table[data-bind="foreach: currentTrades"] tr');
    if (rows.length > 0) {
      rowsCache = Array.from(rows);
    }
    isInitial = true;
  }
  return rowsCache;
}

function start() {
  if (isActive) return;

  const rows = initializeRows();
  if (!rows || rows.length === 0) {
    return;
  }

  isActive = true;
  isPaused = false;

  const startIndex = currentIndex !== null ? currentIndex : direction ? rows.length - 1 : 0;
  const endIndex = direction ? -1 : rows.length;
  const step = direction ? -1 : 1;

  async function clickRow(index) {
    if (isPaused || index === endIndex) {
      if (!isPaused) {
        isActive = false;
        reset();
      }
      return;
    }

    const row = rows[index];
    if (row) {
      row.click();
      await observeSingleMutation();
    } else {
    }

    currentIndex = index;
    setTimeout(() => clickRow(index + step), userTime);
  }

  clickRow(startIndex);
}

function pause() {
  if (!isActive) return;
  isPaused = true;
  isActive = false;
}

function resume() {
  if (!isPaused) return;
  start();
}

function reset() {
  isPaused = false;
  isActive = false;
  isInitial = false;
  rowsCache = null;
  currentIndex = null;
  if (!autoTransition) return;
  pagination();
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
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  });
}

function pagination() {
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
    }
  }
}

function visualize() {
  let observer;

  function observeForAddition() {
    observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.id === "tradesSection") {
              observer.disconnect();

              setTimeout(() => {
                startMenu();
              }, 100);

              observeForRemoval(node);
            }
          });
        }
      });
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
  }

  function observeForRemoval(targetNode) {
    observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.removedNodes.forEach((node) => {
            if (node === targetNode) {
              observer.disconnect();
              stopMenu();
              reset();
              observeForAddition();
            }
          });
        }
      });
    });

    const parentNode = targetNode.parentNode;
    if (parentNode) {
      const config = { childList: true };
      observer.observe(parentNode, config);
    }
  }

  observeForAddition();
}

visualize();
