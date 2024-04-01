let isScript1Running = false
let isScript2Running = false
let timeoutId

const initialScript = localStorage.getItem('initialScript')

let customMainDiv = document.createElement('div')
customMainDiv.classList.add('custom-main')

let script1Button = createButton('Сверху', () => {
	startScript(Up, isScript1Running, isScript2Running)
})

let script2Button = createButton('Снизу', () => {
	startScript(Down, isScript2Running, isScript1Running)
})

customMainDiv.appendChild(script1Button)
customMainDiv.appendChild(script2Button)

customMainDiv.style.display = 'none'

document.body.appendChild(customMainDiv)

function handleTableMutation(mutationsList, observer) {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			mutation.addedNodes.forEach((node) => {
				if (node.tagName === 'TABLE') {
					customMainDiv.style.display = 'block'
				}
			})
		}
	}
}

const observer = new MutationObserver(handleTableMutation)
const config = { childList: true, subtree: true }

observer.observe(document.body, config)

if (initialScript === 'script1') {
	script1Button.click()
} else if (initialScript === 'script2') {
	script2Button.click()
}

function createButton(text, clickHandler) {
	let button = document.createElement('button')
	button.classList.add('btn', 'btn-cs')
	button.textContent = text
	button.addEventListener('click', clickHandler)
	return button
}

function startScript(scriptFunction, currentScriptRunning, otherScriptRunning) {
	if (!currentScriptRunning && !otherScriptRunning) {
		currentScriptRunning = true
		scriptFunction()
		timeoutId = setTimeout(function () {
			currentScriptRunning = false
		}, 1000)
	} else {
		if (otherScriptRunning) {
			clearTimeout(timeoutId)
			otherScriptRunning = false
		}
	}
}

function Up() {
	console.log('Функция Up() вызвана')
	localStorage.setItem('initialScript', 'script1')
	let tableBordered = document.querySelector('table[data-bind="foreach: currentTrades"]')
	let tbodyElements
	let clickerRunning = false
	let currentTbodyIndex = 0
	let currentTrIndex = 0
	let delayTime = localStorage.getItem('delayTime') || 600
	const arrMemoTM = [
		'14 - TM 75 - Боевой танец ',
		'15 - HM 01 - Разрез ',
		'19 - HM 02 - Пике ',
		'46 - TM 05 - Рык ',
		'53 - TM 35 - Огнемёт ',
		'57 - HM 03 - Волна ',
		'58 - TM 13 - Ледяной луч ',
		'59 - TM 14 - Метель ',
		'63 - TM 15 - Гиперлуч',
		'70 - HM 04 - Мощь ',
		'76 - TM 22 - Солнечный луч ',
		'85 - TM 24 - Молния ',
		'86 - TM 73 - Электрошок ',
		'87 - TM 25 - Гроза ',
		'89 - TM 26 - Землетрясение ',
		'91 - TM 28 - Подкоп ',
		'92 - TM 06 - Отравление ',
		'94 - TM 29 - Телекинез ',
		'104 - TM 32 - Раздвоение ',
		'113 - TM 16 - Экран света ',
		'115 - TM 33 - Защитный экран ',
		'126 - TM 38 - Огненный залп ',
		'127 - TM 70 - Водопад ',
		'138 - TM 85 - Пожиратель снов ',
		'141 - TM 101 - Кровопийца ',
		'148 - HM 05 - Вспышка ',
		'153 - TM 64 - Взрыв ',
		'156 - TM 44 - Отдых ',
		'157 - TM 80 - Камнепад ',
		'164 - TM 90 - Приманка ',
		'168 - TM 46 - Кража ',
		'182 - TM 17 - Защита ',
		'188 - TM 36 - Грязевая бомба ',
		'201 - TM 37 - Песчаная буря ',
		'206 - TM 54 - Сломанный меч ',
		'207 - TM 87 - Провокация ',
		'211 - TM 51 - Стальное крыло ',
		'213 - TM 45 - Соблазн ',
		'216 - TM 27 - Доверие ',
		'218 - TM 21 - Разочарование ',
		'219 - TM 20 - Ограждение ',
		'237 - TM 10 - Скрытая сила ',
		'240 - TM 18 - Танец дождя ',
		'241 - TM 11 - Ясный день ',
		'244 - TM 77 - Пародия ',
		'247 - TM 30 - Шар тьмы ',
		'249 - HM 06 - Камнелом ',
		'258 - TM 07 - Град ',
		'259 - TM 41 - Подстрекательство ',
		'261 - TM 61 - Блуждающие огни ',
		'263 - TM 42 - Второе дыхание ',
		'267 - TM 96 - Сила природы ',
		'269 - TM 12 - Насмешка ',
		'280 - TM 31 - Прорыв барьера ',
		'290 - TM 97 - Тайная сила ',
		'291 - TM 94 - Погружение ',
		'315 - TM 50 - Перегрев ',
		'317 - TM 39 - Оползень',
		'332 - TM 40 - Воздушная грация',
		'337 - TM 02 - Коготь дракона',
		'339 - TM 08 - Усиление',
		'347 - TM 04 - Чистый разум',
		'364 - TM 49 - Эхо-волны',
		'367 - TM 68 - Гигаимпульс',
		'377 - TM 67 - Мщение',
		'379 - TM 48 - Хоровое пение',
		'393 - TM 43 - Огненный заряд',
		'397 - TM 59 - Испепеление',
		'406 - TM 55 - Кипяток',
		'410 - TM 57 - Электролуч',
		'417 - TM 72 - Разнонаправленный ток',
		'418 - TM 93 - Дикий заряд',
		'420 - TM 53 - Энергетический шар',
		'421 - TM 86 - Травяные путы',
		'432 - TM 79 - Ледяное дыхание',
		'442 - TM 52 - Прицельный взрыв',
		'445 - TM 47 - Подлый удар',
		'458 - TM 84 - Ядовитое острие',
		'459 - TM 34 - Грязевая волна',
		'461 - TM 09 - Веношок',
		'462 - TM 78 - Перекоп',
		'466 - TM 62 - Акробатика',
		'472 - TM 88 - Удар клювом',
		'474 - TM 58 - Небесный бросок',
		'493 - TM 03 - Психошок',
		'498 - TM 19 - Левитация',
		'499 - TM 92 - Комната смеха',
		'510 - TM 76 - Упрямство жука',
		'511 - TM 89 - Подставной ход',
		'512 - TM 81 - Икс-Ножницы',
		'515 - TM 69 - Полировка',
		'517 - TM 23 - Меткий бросок',
		'519 - TM 71 - Каменное лезвие',
		'523 - TM 65 - Коготь тьмы',
		'529 - TM 82 - Хвост дракона',
		'536 - TM 63 - Эмбарго',
		'537 - TM 56 - Бросок',
		'539 - TM 01 - Заточка когтей',
		'543 - TM 66 - Возмездие',
		'545 - TM 60 - Удерживание',
		'546 - TM 95 - Злобный рык',
		'551 - TM 91 - Световая пушка',
		'553 - TM 74 - Юла ',
		'567 - HM 10 - Секрет',
		'569 - TM 99 - Ослепительный свет ',
		'591 - TM 83 - Заражение ',
		'612 - TM 98 - Разогрев ',
		'631 - HM 08 - Резкий мах ',
		'676 - ТМ 102 - Прямое попадание ',
		'680 - TM 103 - Замедленная бомба',
		'681 - TM 104 - Крик банши',
	]

	function observeTable() {
		let observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					currentTbodyIndex = 0
				}
			})
		})

		observer.observe(tableBordered, { childList: true, subtree: true })
	}

	function startClicker() {
		clickerRunning = true
		updateActiveIndices()
		clickOnTrElements(currentTbodyIndex, currentTrIndex)
		localStorage.setItem('delayTime', delayTime)
	}

	function stopClicker() {
		clickerRunning = false
		currentTbodyIndex = tbodyWithActiveIndex()
		currentTrIndex = trWithActiveIndex(currentTbodyIndex)
		localStorage.removeItem('delayTime')
	}

	function updateActiveIndices() {
		currentTbodyIndex = tbodyWithActiveIndex()
		currentTrIndex = trWithActiveIndex(currentTbodyIndex)
	}

	function tbodyWithActiveIndex() {
		for (let i = 0; i < tbodyElements.length; i++) {
			if (tbodyElements[i].querySelector('.active')) {
				return i
			}
		}
		return 0
	}

	function trWithActiveIndex(tbodyIndex) {
		let trElements = tbodyElements[tbodyIndex].querySelectorAll('tr')
		for (let i = 0; i < trElements.length; i++) {
			if (trElements[i].classList.contains('active')) {
				return i
			}
		}
		return 0
	}

	function clickOnTrElements(tbodyIndex, trIndex) {
		if (clickerRunning && tbodyIndex < tbodyElements.length) {
			let trElements = tbodyElements[tbodyIndex].querySelectorAll('tr')

			if (trIndex < trElements.length) {
				trElements[trIndex].click()

				setTimeout(function () {
					if (clickerRunning) {
						clickOnTrElements(tbodyIndex, trIndex + 1)
					}
				}, delayTime)
			} else {
				setTimeout(function () {
					if (clickerRunning) {
						clickOnTrElements(tbodyIndex + 1, 0)
					}
				}, delayTime)
			}
		}
	}

	function findTbodyAndStart() {
		tableBordered = document.querySelector('table[data-bind="foreach: currentTrades"]')
		if (tableBordered) {
			tbodyElements = tableBordered.querySelectorAll('tbody')
			if (tbodyElements.length > 0) {
				createButtons()
				observeTable()
				return
			}
		}
	}

	function createButtons() {
		if (document.querySelector('.btn-id')) {
			return
		}

		let mainDiv = document.createElement('div')
		mainDiv.classList.add('main')
		document.body.appendChild(mainDiv)

		let inputDelay = document.createElement('input')
		inputDelay.type = 'text'
		inputDelay.placeholder = 'Время задержки (мс)'
		inputDelay.classList.add('custom-input')
		inputDelay.id = 'delayInput'
		mainDiv.appendChild(inputDelay)

		let startButton = document.createElement('button')
		startButton.classList.add('btn-id', 'btn', 'btn-cs')
		startButton.textContent = 'Старт'
		mainDiv.appendChild(startButton)

		let stopButton = document.createElement('button')
		stopButton.classList.add('btn-id', 'btn', 'btn-cs')
		stopButton.textContent = 'Пауза'
		mainDiv.appendChild(stopButton)

		startButton.addEventListener('click', function () {
			let delayInput = document.getElementById('delayInput')
			delayTime = parseInt(delayInput.value) || delayTime

			startClicker()
		})

		stopButton.addEventListener('click', function () {
			stopClicker()
		})
	}

	setInterval(findTbodyAndStart, 2000)

	let memoData = {}

	arrMemoTM.forEach(function (item) {
		let parts = item.split(' - ')
		let key = parseInt(parts[0])
		let tooltipInfo = parts.slice(1).join(' - ')
		memoData[key] = tooltipInfo
	})

	function searchAndUpdateTooltip() {
		let tradeCards = document.querySelectorAll('tbody div.trade-card')
		if (tradeCards.length > 0) {
			tradeCards.forEach(function (tradeCard) {
				let itemTitle = tradeCard.querySelector('span[data-bind="text: itemTitle"]')
				let memoFormatted = tradeCard.querySelector('span[data-bind="text: memoFormated"]')
				if (itemTitle && itemTitle.textContent.trim() === 'Тренировочная Машина' && memoFormatted) {
					let memoText = memoFormatted.textContent.trim()
					if (countDigits(memoText) <= 3) {
						let key = parseInt(memoText.split(' ')[0])
						let tooltipInfo = memoData[key]
						if (tooltipInfo && !memoFormatted.hasAttribute('data-tooltip')) {
							let tooltip = document.createElement('div')
							tooltip.textContent = tooltipInfo.trim()
							tooltip.classList.add('custom-tooltip')

							memoFormatted.setAttribute('data-tooltip', 'true')

							memoFormatted.addEventListener('mouseenter', function () {
								tooltip.style.display = 'block'
								let rect = memoFormatted.getBoundingClientRect()
								tooltip.style.left = rect.left + 'px'
								tooltip.style.top = rect.bottom + window.pageYOffset + 'px'
							})

							memoFormatted.addEventListener('mouseleave', function () {
								tooltip.style.display = 'none'
							})

							tooltip.addEventListener('click', function () {
								tooltip.remove()
							})

							document.body.appendChild(tooltip)
						}
					}
				}
			})
		}
	}

	function countDigits(text) {
		return text.replace(/\D/g, '').length
	}

	setInterval(searchAndUpdateTooltip, 1000)
}

function Down() {
	isScript2Running = false
	localStorage.setItem('initialScript', 'script2')
	let tableBordered = document.querySelector('table[data-bind="foreach: currentTrades"]')
	let tbodyElements
	let clickerRunning = false
	let currentTbodyIndex = 0
	let currentTrIndex = 0
	let delayTime = localStorage.getItem('delayTime') || 600
	const arrMemoTM = [
		'14 - TM 75 - Боевой танец ',
		'15 - HM 01 - Разрез ',
		'19 - HM 02 - Пике ',
		'46 - TM 05 - Рык ',
		'53 - TM 35 - Огнемёт ',
		'57 - HM 03 - Волна ',
		'58 - TM 13 - Ледяной луч ',
		'59 - TM 14 - Метель ',
		'63 - TM 15 - Гиперлуч',
		'70 - HM 04 - Мощь ',
		'76 - TM 22 - Солнечный луч ',
		'85 - TM 24 - Молния ',
		'86 - TM 73 - Электрошок ',
		'87 - TM 25 - Гроза ',
		'89 - TM 26 - Землетрясение ',
		'91 - TM 28 - Подкоп ',
		'92 - TM 06 - Отравление ',
		'94 - TM 29 - Телекинез ',
		'104 - TM 32 - Раздвоение ',
		'113 - TM 16 - Экран света ',
		'115 - TM 33 - Защитный экран ',
		'126 - TM 38 - Огненный залп ',
		'127 - TM 70 - Водопад ',
		'138 - TM 85 - Пожиратель снов ',
		'141 - TM 101 - Кровопийца ',
		'148 - HM 05 - Вспышка ',
		'153 - TM 64 - Взрыв ',
		'156 - TM 44 - Отдых ',
		'157 - TM 80 - Камнепад ',
		'164 - TM 90 - Приманка ',
		'168 - TM 46 - Кража ',
		'182 - TM 17 - Защита ',
		'188 - TM 36 - Грязевая бомба ',
		'201 - TM 37 - Песчаная буря ',
		'206 - TM 54 - Сломанный меч ',
		'207 - TM 87 - Провокация ',
		'211 - TM 51 - Стальное крыло ',
		'213 - TM 45 - Соблазн ',
		'216 - TM 27 - Доверие ',
		'218 - TM 21 - Разочарование ',
		'219 - TM 20 - Ограждение ',
		'237 - TM 10 - Скрытая сила ',
		'240 - TM 18 - Танец дождя ',
		'241 - TM 11 - Ясный день ',
		'244 - TM 77 - Пародия ',
		'247 - TM 30 - Шар тьмы ',
		'249 - HM 06 - Камнелом ',
		'258 - TM 07 - Град ',
		'259 - TM 41 - Подстрекательство ',
		'261 - TM 61 - Блуждающие огни ',
		'263 - TM 42 - Второе дыхание ',
		'267 - TM 96 - Сила природы ',
		'269 - TM 12 - Насмешка ',
		'280 - TM 31 - Прорыв барьера ',
		'290 - TM 97 - Тайная сила ',
		'291 - TM 94 - Погружение ',
		'315 - TM 50 - Перегрев ',
		'317 - TM 39 - Оползень',
		'332 - TM 40 - Воздушная грация',
		'337 - TM 02 - Коготь дракона',
		'339 - TM 08 - Усиление',
		'347 - TM 04 - Чистый разум',
		'364 - TM 49 - Эхо-волны',
		'367 - TM 68 - Гигаимпульс',
		'377 - TM 67 - Мщение',
		'379 - TM 48 - Хоровое пение',
		'393 - TM 43 - Огненный заряд',
		'397 - TM 59 - Испепеление',
		'406 - TM 55 - Кипяток',
		'410 - TM 57 - Электролуч',
		'417 - TM 72 - Разнонаправленный ток',
		'418 - TM 93 - Дикий заряд',
		'420 - TM 53 - Энергетический шар',
		'421 - TM 86 - Травяные путы',
		'432 - TM 79 - Ледяное дыхание',
		'442 - TM 52 - Прицельный взрыв',
		'445 - TM 47 - Подлый удар',
		'458 - TM 84 - Ядовитое острие',
		'459 - TM 34 - Грязевая волна',
		'461 - TM 09 - Веношок',
		'462 - TM 78 - Перекоп',
		'466 - TM 62 - Акробатика',
		'472 - TM 88 - Удар клювом',
		'474 - TM 58 - Небесный бросок',
		'493 - TM 03 - Психошок',
		'498 - TM 19 - Левитация',
		'499 - TM 92 - Комната смеха',
		'510 - TM 76 - Упрямство жука',
		'511 - TM 89 - Подставной ход',
		'512 - TM 81 - Икс-Ножницы',
		'515 - TM 69 - Полировка',
		'517 - TM 23 - Меткий бросок',
		'519 - TM 71 - Каменное лезвие',
		'523 - TM 65 - Коготь тьмы',
		'529 - TM 82 - Хвост дракона',
		'536 - TM 63 - Эмбарго',
		'537 - TM 56 - Бросок',
		'539 - TM 01 - Заточка когтей',
		'543 - TM 66 - Возмездие',
		'545 - TM 60 - Удерживание',
		'546 - TM 95 - Злобный рык',
		'551 - TM 91 - Световая пушка',
		'553 - TM 74 - Юла ',
		'567 - HM 10 - Секрет',
		'569 - TM 99 - Ослепительный свет ',
		'591 - TM 83 - Заражение ',
		'612 - TM 98 - Разогрев ',
		'631 - HM 08 - Резкий мах ',
		'676 - ТМ 102 - Прямое попадание ',
		'680 - TM 103 - Замедленная бомба',
		'681 - TM 104 - Крик банши',
	]
	function observeTable() {
		let observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					currentTbodyIndex = 0
				}
			})
		})

		observer.observe(tableBordered, { childList: true, subtree: true })
	}

	function startClicker() {
		clickerRunning = true
		updateActiveIndices()
		if (!currentTbodyIndex && !currentTrIndex) {
			currentTbodyIndex = tbodyElements.length - 1
			currentTrIndex = tbodyElements[currentTbodyIndex].querySelectorAll('tr').length - 1
		}
		clickOnTrElements(currentTbodyIndex, currentTrIndex)

		localStorage.setItem('delayTime', delayTime)
	}

	function stopClicker() {
		clickerRunning = false
		updateActiveIndices()

		localStorage.removeItem('delayTime')
	}

	function updateActiveIndices() {
		currentTbodyIndex = tbodyWithActiveIndex()
		currentTrIndex = trWithActiveIndex(currentTbodyIndex)
	}

	function tbodyWithActiveIndex() {
		for (let i = 0; i < tbodyElements.length; i++) {
			if (tbodyElements[i].querySelector('.active')) {
				return i
			}
		}
		return 0
	}

	function trWithActiveIndex(tbodyIndex) {
		let trElements = tbodyElements[tbodyIndex].querySelectorAll('tr')
		for (let i = 0; i < trElements.length; i++) {
			if (trElements[i].classList.contains('active')) {
				return i
			}
		}
		return 0
	}

	function clickOnTrElements(tbodyIndex, trIndex) {
		if (tbodyElements && tbodyElements.length > tbodyIndex && tbodyIndex >= 0) {
			let trElements = tbodyElements[tbodyIndex].querySelectorAll('tr')

			if (tbodyIndex === 50 && trIndex === trElements.length - 1) {
				return
			}

			if (trElements.length > trIndex && trIndex >= 0) {
				trElements[trIndex].click()

				setTimeout(function () {
					if (clickerRunning) {
						clickOnTrElements(tbodyIndex, trIndex - 1)
					}
				}, delayTime)
			} else {
				setTimeout(function () {
					if (clickerRunning && tbodyIndex - 1 >= 0) {
						clickOnTrElements(tbodyIndex - 1, tbodyElements[tbodyIndex - 1].querySelectorAll('tr').length - 1)
					}
				}, delayTime)
			}
		}
	}

	function findTbodyAndStart() {
		tableBordered = document.querySelector('table[data-bind="foreach: currentTrades"]')
		if (tableBordered) {
			tbodyElements = tableBordered.querySelectorAll('tbody')
			if (tbodyElements.length > 0) {
				createButtons()
				observeTable()
				return
			}
		}
	}

	function createButtons() {
		if (document.querySelector('.btn-id')) {
			return
		}

		let mainDiv = document.createElement('div')
		mainDiv.classList.add('main')
		document.body.appendChild(mainDiv)

		let inputDelay = document.createElement('input')
		inputDelay.type = 'text'
		inputDelay.placeholder = 'Время задержки (мс)'
		inputDelay.classList.add('custom-input')
		inputDelay.id = 'delayInput'
		mainDiv.appendChild(inputDelay)

		let startButton = document.createElement('button')
		startButton.classList.add('btn-id', 'btn', 'btn-cs')
		startButton.textContent = 'Старт'
		mainDiv.appendChild(startButton)

		let stopButton = document.createElement('button')
		stopButton.classList.add('btn-id', 'btn', 'btn-cs')
		stopButton.textContent = 'Пауза'
		mainDiv.appendChild(stopButton)

		startButton.addEventListener('click', function () {
			let delayInput = document.getElementById('delayInput')
			delayTime = parseInt(delayInput.value) || delayTime

			startClicker()
		})

		stopButton.addEventListener('click', function () {
			stopClicker()
		})
	}

	setInterval(findTbodyAndStart, 2000)

	let memoData = {}

	arrMemoTM.forEach(function (item) {
		let parts = item.split(' - ')
		let key = parseInt(parts[0])
		let tooltipInfo = parts.slice(1).join(' - ')
		memoData[key] = tooltipInfo
	})

	function searchAndUpdateTooltip() {
		let tradeCards = document.querySelectorAll('tbody div.trade-card')
		if (tradeCards.length > 0) {
			tradeCards.forEach(function (tradeCard) {
				let itemTitle = tradeCard.querySelector('span[data-bind="text: itemTitle"]')
				let memoFormatted = tradeCard.querySelector('span[data-bind="text: memoFormated"]')
				if (itemTitle && itemTitle.textContent.trim() === 'Тренировочная Машина' && memoFormatted) {
					let memoText = memoFormatted.textContent.trim()
					if (countDigits(memoText) <= 3) {
						let key = parseInt(memoText.split(' ')[0])
						let tooltipInfo = memoData[key]
						if (tooltipInfo && !memoFormatted.hasAttribute('data-tooltip')) {
							let tooltip = document.createElement('div')
							tooltip.textContent = tooltipInfo.trim()
							tooltip.classList.add('custom-tooltip')

							memoFormatted.setAttribute('data-tooltip', 'true')

							memoFormatted.addEventListener('mouseenter', function () {
								tooltip.style.display = 'block'
								let rect = memoFormatted.getBoundingClientRect()
								tooltip.style.left = rect.left + 'px'
								tooltip.style.top = rect.bottom + window.pageYOffset + 'px'
							})

							memoFormatted.addEventListener('mouseleave', function () {
								tooltip.style.display = 'none'
							})

							tooltip.addEventListener('click', function () {
								tooltip.remove()
							})

							document.body.appendChild(tooltip)
						}
					}
				}
			})
		}
	}

	function countDigits(text) {
		return text.replace(/\D/g, '').length
	}

	setInterval(searchAndUpdateTooltip, 1000)
}
