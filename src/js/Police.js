const currentVersion = chrome.runtime.getManifest().version;
let versionPlugin = false;
let cachedServerData = new Map();
let rowsMap = new Map();
let tradeCardsObserver = null;
function fetchData() {
  fetch("https://59c87fe2c473d859.mokky.dev/arrItems")
    .then((response) => response.json())
    .then((data) => {
      const serverVersionKey = data.find((item) => item.serverVersions);
      if (serverVersionKey && serverVersionKey.serverVersions) {
        const serverVersion = serverVersionKey.serverVersions[0].split(": ")[1];

        if (currentVersion !== serverVersion) {
          const updateMessage = document.createElement("div");
          updateMessage.classList.add("update-message");
          updateMessage.innerHTML = `Версия PoliceAC устарела. <a href="https://github.com//katahu/PoliceAC/archive/refs/heads/main.zip" target="_blank "style="display: inline-flex;"">Обновить <i class="fa-light fa-external-link" style="font-size: 7px;"></i></a>`;
          document.body.append(updateMessage);
          return;
        } else {
          versionPlugin = true;
        }
      }

      data.forEach((array) => {
        Object.keys(array).forEach((key) => {
          if (key === "Уровень" || key === "Проценты" || key === "КрафтовыеПЦ") {
            cachedServerData.set(key, new Map(array[key].map((item) => [item, {}])));
          } else {
            cachedServerData.set(
              key,
              new Map(
                array[key].map((item) => {
                  const [id, ...rest] = item.split(" - ");
                  return [id, { id, item: rest.join(" - ") }];
                })
              )
            );
          }
        });
      });
    })
    .catch((error) => {
      console.error("Ошибка при получении данных с сервера:", error);
    });
}

function getCachedData(key, subKey) {
  if (!cachedServerData.has(key)) return null;
  const map = cachedServerData.get(key);
  return map.has(subKey) ? map.get(subKey) : null;
}

function updateTextCard(tradeCard, data) {
  tradeCard.querySelector('[data-bind="text: memoFormated"]').textContent = data || "N/A";
  deletePrefix(tradeCard);
}

function deletePrefix(tradeCard) {
  const memoElements = tradeCard.querySelectorAll(
    "[data-bind=\"style: {lineHeight: memo() ? '12px' : '20px'}, click: function(){console.log(memo)}\"] div"
  );

  memoElements.forEach((memoDiv) => {
    Array.from(memoDiv.childNodes).forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "m:") {
        memoDiv.removeChild(childNode);
      }
    });

    memoDiv.style.lineHeight = "12px";
  });
}

function getActiveElement(tradeCard) {
  if (!decode) return;
  const itemTitleElement = tradeCard.querySelector('[data-bind="text: itemTitle"]');
  const itemTitle = itemTitleElement ? itemTitleElement.textContent.trim() : "";

  const itemEggElement = tradeCard.querySelector(
    "[data-bind=\"text: itemTitle() + ' ' + '#' + app.addnuls(eggSp_id(), 3) + ' ' + eggPokename()\"]"
  );
  const memoFormattedElement = tradeCard.querySelector('[data-bind="text: memoFormated"]');

  const memoText = memoFormattedElement ? memoFormattedElement.textContent.trim() : null;

  if (itemEggElement) {
    return {
      element: itemEggElement.textContent.trim(),
      type: "egg",
      memoFormattedElement: memoText,
    };
  }

  if (itemTitleElement) {
    return {
      element: itemTitle,
      type: "title",
      memoFormattedElement: memoText,
    };
  }

  return null;
}

function updateTradeCardDetails(tradeCard) {
  if (!cachedServerData) {
    return;
  }

  const activeElement = getActiveElement(tradeCard);
  if (!activeElement) {
    return;
  }

  const { element, type, memoFormattedElement } = activeElement;

  if (type === "title") {
    handleTitleElement(element, memoFormattedElement, tradeCard);
  } else if (type === "egg") {
    handleEggElement(element, memoFormattedElement, tradeCard);
  }
}

function handleTitleElement(itemTitle, memoFormattedElement, tradeCard) {
  const handlers = new Map([
    ["Уровень", processDropObject],
    ["КрафтовыеПЦ", processPercent],
    ["Проценты", processPercentClass],
    ["Витамины", processVitamin],
    ["Пилюля", processVitamin],
    ["Окаменелость", processFossi],
    ["Игрушка", processToy],
    ["Графитовый колокольчик", processGraphiteBell],
    ["Украденный Секретный Ящик", processGraphiteBell],
    ["Крепкий орех", processGraphiteBell],
  ]);

  const skipCacheKeys = new Set(["Графитовый колокольчик", "Украденный Секретный Ящик", "Крепкий орех"]);

  if (handlers.has(itemTitle)) {
    handlers.get(itemTitle)(itemTitle, memoFormattedElement, tradeCard);
    return;
  }

  for (const [key, handler] of handlers.entries()) {
    if (!skipCacheKeys.has(key)) {
      const data = getCachedData(key, itemTitle);
      if (data) {
        handler(itemTitle, memoFormattedElement, tradeCard);
        return;
      }
    }
  }

  handleGeneral(itemTitle, memoFormattedElement, tradeCard);
}
function handleGeneral(itemTitle, memoFormattedElement, tradeCard) {
  const matchingItem = getCachedData(itemTitle, memoFormattedElement);
  if (matchingItem) {
    updateTextCard(tradeCard, matchingItem.item);
  } else {
    if (memoFormattedElement && /^\d{5}$/.test(memoFormattedElement)) {
      const currentDurability = memoFormattedElement.slice(1, 3);
      const totalDurability = memoFormattedElement.slice(3, 5);
      updateTextCard(tradeCard, `[${currentDurability}/${totalDurability}]`);
      return;
    }
  }
}

function handleEggElement(itemTitle, memoFormattedElement, tradeCard) {
  const data = getCachedData("Яйцо", memoFormattedElement);
  if (data) {
    updateTextCard(tradeCard, `${data.item}`);
  }
}

function processDropObject(itemTitle, memoFormattedElement, tradeCard) {
  if (/^\d{5}$/.test(memoFormattedElement.trim())) {
    const level = memoFormattedElement.charAt(0);
    const currentDurability = memoFormattedElement.slice(1, 3);
    const maxDurability = memoFormattedElement.slice(3);
    updateTextCard(tradeCard, `уровень ${level}, [${currentDurability}/${maxDurability}]`);
  }
}

function processPercent(itemTitle, memoFormattedElement, tradeCard) {
  if (/^\d{6,7}$/.test(memoFormattedElement.trim())) {
    let bonusPercent, currentDurability, maxDurability;

    if (memoFormattedElement.length === 6) {
      bonusPercent = memoFormattedElement.slice(0, 2);
      currentDurability = memoFormattedElement.slice(2, 4);
      maxDurability = memoFormattedElement.slice(4, 6);
    } else if (memoFormattedElement.length === 7) {
      bonusPercent = memoFormattedElement.slice(0, 3);
      currentDurability = memoFormattedElement.slice(3, 5);
      maxDurability = memoFormattedElement.slice(5, 7);
    }

    updateTextCard(tradeCard, `+${bonusPercent}% [${currentDurability}/${maxDurability}]`);
  }
}

function processPercentClass(itemTitle, memoFormattedElement, tradeCard) {
  if (/^\d+$/.test(memoFormattedElement.trim())) {
    const updatedText = `качество ${memoFormattedElement}%`;
    updateTextCard(tradeCard, updatedText);
  }
}

function processVitamin(itemTitle, memoFormattedElement, tradeCard) {
  if (!memoFormattedElement) {
    memoFormattedElement = "0";
  }

  const data = getCachedData("Пилюля", memoFormattedElement);
  if (!memoFormattedElement || memoFormattedElement === "0") {
    const parentElement = tradeCard.querySelector(
      "[data-bind=\"style: {lineHeight: memo() ? '12px' : '20px'}, click: function(){console.log(memo)}\"]"
    );

    if (!parentElement) {
      return;
    }
    parentElement.style.lineHeight = "12px";
    const newDiv = document.createElement("div");
    newDiv.style.lineHeight = "12px";

    const newSpan = document.createElement("span");
    newSpan.textContent = `${data.item}`;
    newDiv.appendChild(newSpan);

    parentElement.appendChild(newDiv);
  } else {
    updateTextCard(tradeCard, `${data.item}`);
  }
}

function processFossi(itemTitle, memoFormattedElement, tradeCard) {
  if (/^\d{5}$/.test(memoFormattedElement)) {
    const pokemon = memoFormattedElement.slice(0, 3);
    const percentage = memoFormattedElement.slice(3, 5);
    const data = getCachedData("Яйцо", pokemon);

    if (data) {
      updateTextCard(tradeCard, `${data.item} ${percentage}% ДНК`);
    }
  }
}

function processToy(itemTitle, memoFormattedElement, tradeCard) {
  const data = cachedServerData.get("Яйцо").get(memoFormattedElement);

  updateTextCard(tradeCard, `${data.item}`);
}
function processGraphiteBell(itemTitle, memoFormattedElement, tradeCard) {
  const totalDays = itemTitle === "Крепкий орех" ? 62 : 31;
  const endTime = new Date(memoFormattedElement * 1000);
  const startTime = new Date(endTime);
  startTime.setDate(startTime.getDate() - totalDays);

  const saleTimeElement = document.querySelector('.pointer.active span[data-bind="text: dat"]');
  if (!saleTimeElement) return;
  const saleTimeText = saleTimeElement.textContent.trim();
  const saleTime = new Date(saleTimeText);

  const elapsedDays = (saleTime - startTime) / (1000 * 60 * 60 * 24);
  const progress = Math.max(100 - elapsedDays * (100 / totalDays), 0);

  updateTextCard(tradeCard, `${Math.round(progress)}%`);
}

observeDynamicTradeCards();

function extractTable() {
  if (!decode) return;
  const rows = Array.from(document.querySelectorAll('tr[data-bind*="foreach: $parent.columns"]'));

  rowsMap.clear();

  const handlers = new Map([
    ["Проценты", processPercentClassTable],
    ["Уровень", processDropObjectTable],
    ["КрафтовыеПЦ", processPercentTable],
    ["Окаменелость", processFossiTable],
    ["Игрушка", processToyTable],
    ["Витамины", processVitaminTable],
    ["Пилюля", processVitaminTable],
    ["Графитовый колокольчик", processGraphiteBellTable],
    ["Украденный Секретный Ящик", processGraphiteBellTable],
    ["Крепкий орех", processGraphiteBellTable],
  ]);

  const skipCacheKeys = new Set(["Графитовый колокольчик", "Украденный Секретный Ящик", "Крепкий орех"]);

  for (const row of rows) {
    const cells = row.getElementsByTagName("td");
    if (cells.length >= 4) {
      const itemTable = cells[2];
      const memoTable = cells[3];

      const item = itemTable?.textContent.trim();
      const memo = memoTable?.textContent.trim();

      if (item) {
        const data = { row, item, itemTable, memo };

        if (!rowsMap.has(item)) {
          rowsMap.set(item, []);
        }
        rowsMap.get(item).push(data);

        if (!skipCacheKeys.has(item)) {
          for (const [key, handler] of handlers.entries()) {
            const cachedData = getCachedData(key, item);
            if (cachedData) {
              handler(data);
            }
          }
        }

        if (handlers.has(item)) {
          handlers.get(item)(data);
        }

        if (!handlers.has(item) && !skipCacheKeys.has(item) && !item.startsWith("Страница")) {
          handleGeneralTable(data);
        }
      }
    }
  }
}

function updateItemTextContent(itemTable, updateItem) {
  if (itemTable) {
    itemTable.textContent += ` ${updateItem}`;
  }
}

function handleGeneralTable(data) {
  const { memo, item, itemTable } = data;
  const cachedServerData = getCachedData(item, memo);

  if (cachedServerData && cachedServerData.item) {
    updateItemTextContent(itemTable, cachedServerData.item);
  } else {
    if (/^\d{5}$/.test(memo)) {
      const currentDurability = memo.slice(1, 3);
      const totalDurability = memo.slice(3, 5);
      updateItemTextContent(itemTable, `[${currentDurability}/${totalDurability}]`);
    }
  }
}

function processPercentClassTable(data) {
  const { memo, itemTable } = data;

  if (/^\d+$/.test(memo.trim())) {
    updateItemTextContent(itemTable, `,  качество ${memo}%`);
  }
}

function processDropObjectTable(data) {
  const { memo, itemTable } = data;
  if (/^\d{5}$/.test(memo.trim())) {
    const level = memo.charAt(0);
    const currentDurability = memo.slice(1, 3);
    const totalDurability = memo.slice(3);
    updateItemTextContent(itemTable, `уровень ${level}, [${currentDurability}/${totalDurability}]`);
  }
}

function processFossiTable(data) {
  const { memo, itemTable } = data;
  if (/^\d{5}$/.test(memo)) {
    const pokemon = memo.slice(0, 3);
    const percentage = memo.slice(3, 5);
    const cachedServerData = getCachedData("Яйцо", pokemon);
    updateItemTextContent(itemTable, ` ${cachedServerData.item} ${percentage}% ДНК`);
  }
}

function processPercentTable(data) {
  const { memo, itemTable } = data;

  if (/^\d{6,7}$/.test(memo.trim())) {
    let bonusPercent, currentDurability, maxDurability;
    if (memo.length === 6) {
      bonusPercent = memo.slice(0, 2);
      currentDurability = memo.slice(2, 4);
      maxDurability = memo.slice(4, 6);
    } else if (memo.length === 7) {
      bonusPercent = memo.slice(0, 3);
      currentDurability = memo.slice(3, 5);
      maxDurability = memo.slice(5, 7);
    }
    updateItemTextContent(itemTable, `+${bonusPercent}% [${currentDurability}/${maxDurability}]`);
  }
}

function processToyTable(data) {
  const { memo, itemTable } = data;
  const cachedServerData = getCachedData("Яйцо", memo);
  updateItemTextContent(itemTable, ` ${cachedServerData.item}`);
}

function processVitaminTable(data) {
  const { memo, itemTable } = data;
  const cachedServerData = getCachedData("Пилюля", memo);

  updateItemTextContent(itemTable, ` ${cachedServerData.item}`);
}

function processGraphiteBellTable(data) {
  const { memo, itemTable } = data;

  const nameItem = itemTable.textContent.trim();
  const totalDays = nameItem === "Крепкий орех" ? 62 : 31;

  const endTime = new Date(memo * 1000);
  const now = new Date();

  const remainingDays = (endTime - now) / (1000 * 60 * 60 * 24);

  const progress = Math.max(Math.min((remainingDays / totalDays) * 100, 100), 0);

  updateItemTextContent(itemTable, `${Math.round(progress)}%`);
}

function observeDynamicTradeCards() {
  if (tradeCardsObserver) {
    return;
  }

  tradeCardsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList.contains("trade-card")) {
          if (!node.dataset.processed) {
            updateTradeCardDetails(node);
            node.dataset.processed = true;
          }
        }
      });
    });
  });

  tradeCardsObserver.observe(document.body, { childList: true, subtree: true });
}

function stopObserveDynamicTradeCards() {
  if (tradeCardsObserver) {
    tradeCardsObserver.disconnect();
    tradeCardsObserver = null;
  }
}

function observeDynamicMain() {
  const observeSectionRows = (section) => {
    let timeoutId = null;

    const processRowChanges = () => {
      extractTable();
    };

    const sectionObserverCallback = (mutationsList) => {
      let relevantChange = false;

      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.tagName === "TR" && !node.hasAttribute("style")) {
            relevantChange = true;
          }
        });
      });

      if (relevantChange) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(processRowChanges, 500);
      }
    };

    const sectionObserver = new MutationObserver(sectionObserverCallback);

    sectionObserver.observe(section, { childList: true, subtree: true });
  };

  const isInsideUsersSection = (element) => {
    let parent = element.parentElement;
    while (parent) {
      if (parent.id === "usersSection") return true;
      parent = parent.parentElement;
    }
    return false;
  };

  const observeSection = (section) => {
    if (section.hasAttribute("style")) {
      return;
    }

    if (!isInsideUsersSection(section)) {
      return;
    }

    observeSectionRows(section);
  };

  const parentObserverCallback = (mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const logTableSection = node.querySelector("#logTableSection");
          if (logTableSection) {
            observeSection(logTableSection);
          }
          if (node.id === "usersSection") {
            observeDynamicTradeCards();
          }
          if (node.id === "tradesSection") {
            observeDynamicTradeCards();
          }
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.id === "usersSection") {
            stopObserveDynamicTradeCards();
          }
          if (node.id === "tradesSection") {
            stopObserveDynamicTradeCards();
          }
        }
      });
    });
  };

  const parentElement = document.body;

  const parentObserver = new MutationObserver(parentObserverCallback);

  parentObserver.observe(parentElement, { childList: true, subtree: true });
}

observeDynamicMain();

fetchData();
