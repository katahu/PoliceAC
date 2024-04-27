const TEST_CHOICE_KEY = 'testChoice'
const DELAY_KEY = 'clickDelay'
let clickPaused = false
let intervalId = null
let currentRowIndex = 0
let clickDelay = parseInt(localStorage.getItem(DELAY_KEY)) || 1000
Tooltip()

document.body.onload = function () {
	const selectedTest = localStorage.getItem(TEST_CHOICE_KEY)

	const midcontainer = document.createElement('div')
	midcontainer.classList.add('mid-container')
	midcontainer.style.display = 'none'
	document.body.appendChild(midcontainer)
	1.08
	const input = document.createElement('input')
	input.type = 'text'
	input.placeholder = 'Время задержки (мс)'
	input.classList.add('mid-input')
	input.style.display = 'none'
	midcontainer.appendChild(input)

	const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
	svgElement.setAttribute('viewBox', '0 0 512 512')
	svgElement.classList.add('svg-all', 'gr')
	const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
	pathElement.setAttribute('d', 'M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z')
	svgElement.appendChild(pathElement)
	midcontainer.appendChild(svgElement)

	const startcontainer = document.createElement('div')
	startcontainer.classList.add('start-container')
	startcontainer.style.display = 'none'

	midcontainer.appendChild(startcontainer)

	const svgUp = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svgUp.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
	svgUp.setAttribute('viewBox', '0 0 384 512')
	svgUp.classList.add('svg-up', 'svg-all', 'gr')
	const pathElementUp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
	pathElementUp.setAttribute('d', 'M192 82.4L334.7 232.3c.8 .8 1.3 2 1.3 3.2c0 2.5-2 4.6-4.6 4.6H248c-13.3 0-24 10.7-24 24V432H160V264c0-13.3-10.7-24-24-24H52.6c-2.5 0-4.6-2-4.6-4.6c0-1.2 .5-2.3 1.3-3.2L192 82.4zm192 153c0-13.5-5.2-26.5-14.5-36.3L222.9 45.2C214.8 36.8 203.7 32 192 32s-22.8 4.8-30.9 13.2L14.5 199.2C5.2 208.9 0 221.9 0 235.4c0 29 23.5 52.6 52.6 52.6H112V432c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48V288h59.4c29 0 52.6-23.5 52.6-52.6z')

	if (selectedTest === 'clickTrUp') {
		pathElementUp.setAttribute('d', 'M169.4 41.4c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H256V440c0 22.1-17.9 40-40 40H168c-22.1 0-40-17.9-40-40V256H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l160-160z')
	} else {
		pathElementUp.setAttribute('d', 'M192 82.4L334.7 232.3c.8 .8 1.3 2 1.3 3.2c0 2.5-2 4.6-4.6 4.6H248c-13.3 0-24 10.7-24 24V432H160V264c0-13.3-10.7-24-24-24H52.6c-2.5 0-4.6-2-4.6-4.6c0-1.2 .5-2.3 1.3-3.2L192 82.4zm192 153c0-13.5-5.2-26.5-14.5-36.3L222.9 45.2C214.8 36.8 203.7 32 192 32s-22.8 4.8-30.9 13.2L14.5 199.2C5.2 208.9 0 221.9 0 235.4c0 29 23.5 52.6 52.6 52.6H112V432c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48V288h59.4c29 0 52.6-23.5 52.6-52.6z')
	}
	svgUp.appendChild(pathElementUp)
	startcontainer.appendChild(svgUp)

	const svgDwn = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svgDwn.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
	svgDwn.setAttribute('viewBox', '0 0 384 512')
	svgDwn.classList.add('svg-dwn', 'svg-all', 'gr')
	const pathElementDwn = document.createElementNS('http://www.w3.org/2000/svg', 'path')

	if (selectedTest === 'clickTrDown') {
		pathElementDwn.setAttribute('d', 'M214.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l96 0 0-184c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 184 96 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-160 160z')
	} else {
		pathElementDwn.setAttribute('d', 'M192 429.6L49.3 279.7c-.8-.8-1.3-2-1.3-3.2c0-2.5 2-4.6 4.6-4.6l83.4 0c13.3 0 24-10.7 24-24l0-168 64 0 0 168c0 13.3 10.7 24 24 24l83.4 0c2.5 0 4.6 2 4.6 4.6c0 1.2-.5 2.3-1.3 3.2L192 429.6zM0 276.6c0 13.5 5.2 26.5 14.5 36.3L161.1 466.8c8.1 8.5 19.2 13.2 30.9 13.2s22.8-4.8 30.9-13.2L369.5 312.8c9.3-9.8 14.5-22.8 14.5-36.3c0-29-23.5-52.6-52.6-52.6L272 224l0-144c0-26.5-21.5-48-48-48l-64 0c-26.5 0-48 21.5-48 48l0 144-59.4 0C23.5 224 0 247.5 0 276.6z')
	}
	svgDwn.appendChild(pathElementDwn)
	startcontainer.appendChild(svgDwn)

	function Alarm() {
		const alarm = document.createElement('div')
		alarm.textContent = 'Перезагрузите страницу, для вступления изменений в силу.'
		alarm.classList.add('alarm')
		document.body.appendChild(alarm)
		setTimeout(() => {
			alarm.classList.add('fadeOutAlarm')
			setTimeout(() => {
				alarm.remove()
			}, 2000)
		}, 3500)
	}

	svgUp.addEventListener('click', () => {
		localStorage.setItem(TEST_CHOICE_KEY, 'clickTrUp')
		Alarm()

		pathElementUp.setAttribute('d', 'M169.4 41.4c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H256V440c0 22.1-17.9 40-40 40H168c-22.1 0-40-17.9-40-40V256H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l160-160z')

		pathElementDwn.setAttribute('d', 'M192 429.6L49.3 279.7c-.8-.8-1.3-2-1.3-3.2c0-2.5 2-4.6 4.6-4.6l83.4 0c13.3 0 24-10.7 24-24l0-168 64 0 0 168c0 13.3 10.7 24 24 24l83.4 0c2.5 0 4.6 2 4.6 4.6c0 1.2-.5 2.3-1.3 3.2L192 429.6zM0 276.6c0 13.5 5.2 26.5 14.5 36.3L161.1 466.8c8.1 8.5 19.2 13.2 30.9 13.2s22.8-4.8 30.9-13.2L369.5 312.8c9.3-9.8 14.5-22.8 14.5-36.3c0-29-23.5-52.6-52.6-52.6L272 224l0-144c0-26.5-21.5-48-48-48l-64 0c-26.5 0-48 21.5-48 48l0 144-59.4 0C23.5 224 0 247.5 0 276.6z')
	})

	svgDwn.addEventListener('click', () => {
		localStorage.setItem(TEST_CHOICE_KEY, 'clickTrDown')
		Alarm()
		pathElementUp.setAttribute('d', 'M192 82.4L334.7 232.3c.8 .8 1.3 2 1.3 3.2c0 2.5-2 4.6-4.6 4.6H248c-13.3 0-24 10.7-24 24V432H160V264c0-13.3-10.7-24-24-24H52.6c-2.5 0-4.6-2-4.6-4.6c0-1.2 .5-2.3 1.3-3.2L192 82.4zm192 153c0-13.5-5.2-26.5-14.5-36.3L222.9 45.2C214.8 36.8 203.7 32 192 32s-22.8 4.8-30.9 13.2L14.5 199.2C5.2 208.9 0 221.9 0 235.4c0 29 23.5 52.6 52.6 52.6H112V432c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48V288h59.4c29 0 52.6-23.5 52.6-52.6z')

		pathElementDwn.setAttribute('d', 'M214.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l96 0 0-184c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 184 96 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-160 160z')
	})

	const selectedUpDn = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	selectedUpDn.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
	selectedUpDn.setAttribute('viewBox', '0 0 384 512')
	selectedUpDn.classList.add('svg-all', 'gr')
	const pathElementSelect = document.createElementNS('http://www.w3.org/2000/svg', 'path')
	pathElementSelect.setAttribute('d', 'M320 64H280h-9.6C263 27.5 230.7 0 192 0s-71 27.5-78.4 64H104 64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zM80 112v24c0 13.3 10.7 24 24 24h88 88c13.3 0 24-10.7 24-24V112h16c8.8 0 16 7.2 16 16V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16H80zm88-32a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm3.3 155.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L112 249.4 99.3 236.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l24 24c6.2 6.2 16.4 6.2 22.6 0l48-48zM192 272c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm-32 96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm-48 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z')
	selectedUpDn.appendChild(pathElementSelect)
	midcontainer.appendChild(selectedUpDn)

	let isVisible = false

	svgElement.addEventListener('click', () => {
		isVisible = !isVisible
		if (isVisible) {
			svgElement.classList.remove('gr')
			svgElement.classList.add('bl')
			pathElement.setAttribute('d', 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z')
			input.classList.remove('animate-out')
			input.classList.add('animate-in')
			input.style.display = 'block'
		} else {
			svgElement.classList.add('gr')
			svgElement.classList.remove('bl')
			pathElement.setAttribute('d', 'M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z')
			input.classList.remove('animate-in')
			input.classList.add('animate-out')
			setTimeout(() => {
				input.style.display = 'none'
			}, 495)
		}
	})
	let isVisibleUpDn = false

	selectedUpDn.addEventListener('click', () => {
		isVisibleUpDn = !isVisibleUpDn
		if (isVisibleUpDn) {
			selectedUpDn.classList.remove('gr')
			selectedUpDn.classList.add('bl')
			pathElementSelect.setAttribute('d', 'M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-4.7 132.7c6.2 6.2 6.2 16.4 0 22.6l-64 64c-6.2 6.2-16.4 6.2-22.6 0l-32-32c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L112 249.4l52.7-52.7c6.2-6.2 16.4-6.2 22.6 0zM192 272c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H208c-8.8 0-16-7.2-16-16zm-16 80H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z')
			startcontainer.classList.remove('animate-out')
			startcontainer.classList.add('animate-in')
			startcontainer.style.display = 'flex'
		} else {
			selectedUpDn.classList.remove('bl')
			selectedUpDn.classList.add('gr')
			pathElementSelect.setAttribute('d', 'M320 64H280h-9.6C263 27.5 230.7 0 192 0s-71 27.5-78.4 64H104 64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zM80 112v24c0 13.3 10.7 24 24 24h88 88c13.3 0 24-10.7 24-24V112h16c8.8 0 16 7.2 16 16V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16H80zm88-32a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm3.3 155.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L112 249.4 99.3 236.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l24 24c6.2 6.2 16.4 6.2 22.6 0l48-48zM192 272c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm-32 96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm-48 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z')
			startcontainer.classList.remove('animate-in')
			startcontainer.classList.add('animate-out')
			setTimeout(() => {
				startcontainer.style.display = 'none'
			}, 495)
		}
	})
	const startbtn = document.createElement('button')
	startbtn.classList.add('btn', 'btn-cs')
	startbtn.textContent = 'Старт'
	startbtn.disabled = false
	midcontainer.appendChild(startbtn)

	const pausebtn = document.createElement('button')
	pausebtn.classList.add('btn', 'btn-cs')
	pausebtn.textContent = 'Пауза'
	pausebtn.disabled = true
	pausebtn.style.cursor = 'not-allowed'
	midcontainer.appendChild(pausebtn)

	function saveClickDelay(delay) {
		localStorage.setItem(DELAY_KEY, delay.toString())
	}

	startbtn.addEventListener('click', () => {
		const inputDelay = parseInt(input.value)
		if (!isNaN(inputDelay) && inputDelay > 0) {
			clickDelay = inputDelay
			saveClickDelay(clickDelay)
		}
		pausebtn.disabled = false
		startbtn.disabled = true
		startbtn.style.cursor = 'not-allowed'
		pausebtn.style.cursor = 'pointer'
		if (selectedTest === 'clickTrUp') {
			clickTrUp()
		} else if (selectedTest === 'clickTrDown') {
			clickTrDown()
		}
		clearIndex(startbtn, pausebtn)
		clickPaused = false
	})

	pausebtn.addEventListener('click', () => {
		clickPaused = !clickPaused
		pausebtn.disabled = true
		startbtn.disabled = false
		pausebtn.style.cursor = 'not-allowed'
		startbtn.style.cursor = 'pointer'
		clearInterval(intervalId)
	})

	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				if (document.getElementById('tradesSection')) {
					midcontainer.style.display = 'flex'
				} else {
					midcontainer.style.display = 'none'
				}
			}
		}
	})

	const pageContent = document.getElementById('pageContent')
	observer.observe(pageContent, { childList: true, subtree: true })
}

function clickTrUp() {
	function clickRowWithDelay(row, delay) {
		row.click()
	}

	var rows = document.querySelectorAll('table[data-bind="foreach: currentTrades"] tr')
	var delay = clickDelay
	var currentRowIndex = rows.length - 1

	intervalId = setInterval(function () {
		if (!clickPaused) {
			if (currentRowIndex >= 0) {
				clickRowWithDelay(rows[currentRowIndex], delay)
				currentRowIndex--
			} else {
				clearInterval(intervalId)
			}
		}
	}, delay)
}

function clickTrDown() {
	function clickRowWithDelay(row, delay) {
		row.click()
	}

	var rows = document.querySelectorAll('table[data-bind="foreach: currentTrades"] tr')
	var delay = clickDelay

	intervalId = setInterval(function () {
		if (!clickPaused) {
			if (currentRowIndex < rows.length) {
				clickRowWithDelay(rows[currentRowIndex], delay)
				currentRowIndex++
			} else {
				clearInterval(intervalId)
			}
		}
	}, delay)
}

function clearIndex(startbtn, pausebtn) {
	const elements = document.querySelectorAll('[data-bind="css:{active: $root.paginator().currentPage() == page}"]')

	const observer = new MutationObserver((mutationsList, observer) => {
		for (let mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				currentRowIndex = 0
				startbtn.disabled = false
				pausebtn.disabled = true
				pausebtn.style.cursor = 'not-allowed'
				startbtn.style.cursor = 'pointer'
			}
		}
	})

	elements.forEach((element) => {
		observer.observe(element, { attributes: true })
	})
	let updIndex = document.querySelector('div[data-bind="click: $root.newSearch"]')
	updIndex.addEventListener('click', () => {
		startbtn.disabled = false
		pausebtn.disabled = true
		pausebtn.style.cursor = 'not-allowed'
		startbtn.style.cursor = 'pointer'
		currentRowIndex = 0
	})
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

	const arrBall = [
		[
			'1 - Монстробол',
			'2 - Гритбол',
			'3 - Мастербол',
			'4 - Ультрабол',
			'5 - Люксбол',
			'6 - Фастбол',
			'7 - Френдбол',
			'8 - Левелбол',
			'9 - Лавбол',
			'10 - Лурбол',
			'11 - Таймербол',
			'12 - Нестбол',
			'13 - Даркбол',
			'14 - Лайтбол',
			'15 - Новичка',
			'16 - Трансбол',
			'18 - Супердаркбол',
			'30 - Монстробол Браконьера',
			'101 - Багбол',
			'102 - Блэкбол',
			'103 - Драгонбол',
			'104 - Электробол',
			'105 - Файтбол',
			'106 - Фаербол',
			'107 - Флайбол',
			'108 - Гостбол',
			'109 - Грасбол',
			'110 - Граундбол',
			'111 - Айсбол',
			'112 - Нормобол',
			'113 - Токсикбол',
			'114 - Псибол',
			'115 - Стоунбол',
			'116 - Стилбол',
			'117 - Дайвбол',
			///
		],
	]
	const tooltipsMemoTM = {}

	const tooltipsBall = {}

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
								const [key, ...rest] = memoText.split(' - ')
								const tooltipText = tooltipsMemoTM[key]
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
							} else if (titleText === 'Монстробол') {
								const [key, ...rest] = memoText.split(' - ')
								const tooltipText = tooltipsBall[key]
								if (tooltipText) {
									createTooltip(node, tooltipText)
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

	arrMemoTM.forEach((item) => {
		const [key, ...rest] = item.split(' - ')
		tooltipsMemoTM[key] = rest.join(' - ')
	})

	arrBall.forEach((ballArray) => {
		ballArray.forEach((item) => {
			const [key, value] = item.split(' - ')
			tooltipsBall[key] = value
		})
	})
}
