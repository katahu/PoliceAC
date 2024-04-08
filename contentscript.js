let isScript1Running = false
let isScript2Running = false
let timeoutId

Tooltip()

const initialScript = localStorage.getItem('initialScript') || ''
const element = document.querySelector('#my-element')

function createCustomDivWithButtons(buttonTexts, clickHandlers) {
	const customMainDiv = document.createElement('div')
	customMainDiv.classList.add('custom-main')
	customMainDiv.style.display = 'none'

	buttonTexts.forEach((text, index) => {
		const button = document.createElement('button')
		button.classList.add('btn', 'btn-cs')
		button.textContent = text
		button.addEventListener('click', () => {
			clickHandlers[index]()
		})
		customMainDiv.appendChild(button)
	})

	return customMainDiv
}

const customMainDiv = createCustomDivWithButtons(['Сверху', 'Снизу'], [() => startScript(Up, isScript1Running, isScript2Running), () => startScript(Down, isScript2Running, isScript1Running)])
let ulNav = document.querySelector('.nav')
ulNav.appendChild(customMainDiv)

if (initialScript === 'script1') {
	customMainDiv.children[0].click()
} else if (initialScript === 'script2') {
	customMainDiv.children[1].click()
}

const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			if (document.getElementById('tradesSection')) {
				customMainDiv.style.display = 'flex'
			} else {
				customMainDiv.style.display = 'none'
			}
		}
	}
})

observer.observe(document.body, { childList: true, subtree: true })

function startScript(scriptFunction, currentScriptRunning, otherScriptRunning) {
	if (!currentScriptRunning && !otherScriptRunning) {
		currentScriptRunning = true
		scriptFunction()
		timeoutId = setTimeout(() => {
			currentScriptRunning = false
		}, 1000)
	} else if (otherScriptRunning) {
		clearTimeout(timeoutId)
		otherScriptRunning = false
	}
}

function Up() {
	console.log('Функция Up() вызвана')
	let tableBordered
	let tbodyElements
	let clickerRunning = false
	let currentTbodyIndex = 0
	let currentTrIndex = 0
	let delayTime = parseInt(localStorage.getItem('delayTime')) || 600

	const mainDiv = document.createElement('div')
	mainDiv.classList.add('main')
	mainDiv.style.display = 'none'
	document.body.appendChild(mainDiv)

	const inputDelay = document.createElement('input')
	inputDelay.type = 'text'
	inputDelay.placeholder = 'Время задержки (мс)'
	inputDelay.classList.add('custom-input')
	inputDelay.id = 'delayInput'
	mainDiv.appendChild(inputDelay)

	const startButton = createButton('Старт')
	const stopButton = createButton('Пауза')
	mainDiv.appendChild(startButton)
	mainDiv.appendChild(stopButton)

	startButton.addEventListener('click', handleStart)
	stopButton.addEventListener('click', handleStop)

	const observer = new MutationObserver(handleMutation)
	observer.observe(document.body, { childList: true, subtree: true })

	function handleStart() {
		const delayInput = document.getElementById('delayInput')
		delayTime = parseInt(delayInput.value) || delayTime
		startClicker()
	}

	function handleStop() {
		stopClicker()
	}

	function handleMutation(mutationsList) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				const tableWithTbody = document.querySelector('table[data-bind="foreach: currentTrades"]')
				if (tableWithTbody) {
					observeTable()
					mainDiv.style.display = 'flex'
				} else {
					mainDiv.style.display = 'none'
				}
			}
		}
	}

	function observeTable() {
		tableBordered = document.querySelector('table[data-bind="foreach: currentTrades"]')
		if (tableBordered) {
			const observer = new MutationObserver(() => {
				currentTbodyIndex = 0
			})
			observer.observe(tableBordered, { childList: true, subtree: true })
		}
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
		const trElements = tbodyElements[tbodyIndex].querySelectorAll('tr')
		for (let i = 0; i < trElements.length; i++) {
			if (trElements[i].classList.contains('active')) {
				return i
			}
		}
		return 0
	}

	function clickOnTrElements(tbodyIndex, trIndex) {
		if (clickerRunning && tbodyIndex < tbodyElements.length) {
			const trElements = tbodyElements[tbodyIndex].querySelectorAll('tr')
			if (trIndex < trElements.length) {
				trElements[trIndex].click()
				setTimeout(() => {
					if (clickerRunning) {
						clickOnTrElements(tbodyIndex, trIndex + 1)
					}
				}, delayTime)
			} else {
				setTimeout(() => {
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
				return
			}
		}
	}

	setInterval(findTbodyAndStart, 2000)
}

function createButton(text) {
	const button = document.createElement('button')
	button.classList.add('btn-id', 'btn', 'btn-cs')
	button.textContent = text
	return button
}

function Tooltip() {
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
	   const tooltips = {}

			function createTooltip(node, text) {
				let tooltipDiv = node.querySelector('.tooltips')
				if (tooltipDiv) {
					node.removeChild(tooltipDiv)
				}
				tooltipDiv = document.createElement('div')
				tooltipDiv.classList.add('tooltips')
				tooltipDiv.textContent = text
				node.appendChild(tooltipDiv)
			}

			function handleMutation(mutationsList, observer) {
				for (let mutation of mutationsList) {
					if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'data-bind')) {
						const nodes = mutation.addedNodes || [mutation.target]
						nodes.forEach((node) => {
							if (node.classList && node.classList.contains('trade-card')) {
								const titleElement = node.querySelector('[data-bind="text: itemTitle"]')
								const memoElement = node.querySelector('span[data-bind="text: memoFormated"]')
								if (titleElement && memoElement) {
									const titleText = titleElement.textContent.trim()
									const memoText = memoElement.textContent.trim()
									if (titleText === 'Тренировочная Машина') {
										const [key, ...rest] = memoText.split(' ')
										const tooltipText = tooltips[key]
										if (tooltipText) {
											createTooltip(node, tooltipText)
										}
									} else if (titleText === 'Графитовый колокольчик') {
										const activeRows = document.querySelectorAll('tr.active')
										if (activeRows.length > 0) {
											activeRows.forEach((row) => {
												const datElement = row.querySelector('span[data-bind="text: dat"]')
												if (datElement) {
													const burnTime = (new Date(datElement.textContent) - new Date(memoText * 1000)) / (1000 * 60 * 60 * 24)
													const percentRemaining = ((burnTime / 31) * 100).toFixed(2)
													const positivePercentRemaining = Math.abs(percentRemaining)
													createTooltip(node, `${positivePercentRemaining}%`)
												}
											})
										}
									}
								}
							}
						})
					}
				}
			}

			const observer = new MutationObserver(handleMutation)
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['data-bind'],
			})

			// Заполнение объекта tooltips
			arrMemoTM.forEach((item) => {
				const [key, ...rest] = item.split(' - ')
				tooltips[key] = rest.join(' - ')
			})
}
