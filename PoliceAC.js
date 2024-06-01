let localVersion = '0.5'
let pauseClicked = false
let timeout = null
let currentIndex = -1
let isPaused = false
let currentPage = 1
let savedDirection = 'down'
let autoPagination = false
let clickDelay = '1000'

$(document).ready(function () {
	savedDirection = localStorage.getItem('clickDirection') || 'up'
	autoPagination = localStorage.getItem('autoPagination') === 'true'
	clickDelay = localStorage.getItem('clickDelay') || '1000'

	if (savedDirection === 'up') {
		iconArrowUp.addClass('fa-solid bl').removeClass('fa-regular gr')
		iconArrowDown.removeClass('fa-solid bl').addClass('fa-regular gr')
	} else {
		iconArrowDown.addClass('fa-solid bl').removeClass('fa-regular gr')
		iconArrowUp.removeClass('fa-solid bl').addClass('fa-regular gr')
	}

	if (autoPagination) {
		iconAutoPages.addClass('fa-solid bl').removeClass('fa-regular gr')
	} else {
		iconAutoPages.removeClass('fa-solid bl').addClass('fa-regular gr')
	}
})

const container = $('<div></div>').addClass('Pcontainer')
const timeInput = $('<input type="text" placeholder="Время задержки (мс)"autocomplete="off"></input>').attr('id', 'animate-inp').addClass('animate-out').css('display', 'none')

const iconTime = $('<i></i>').addClass('fa-regular fa-clock gr').attr('title', 'Время')
const listPatch = $('<i></i>').addClass('fa-regular fa-clipboard-list-check gr').attr('title', 'Меню')
const iconInfo = $('<i>').addClass('fa-regular fa-circle-info no-p sm')

const patchContainer = $('<div></div>').attr('id', 'animate-ex').addClass('animate-out').css('display', 'none')
const iconArrowUp = $('<i></i>').addClass('fa-regular fa-up gr sm').attr('title', 'Вверх')
const iconArrowDown = $('<i></i>').addClass('fa-regular fa-down gr sm').attr('title', 'Вниз')
const iconAutoPages = $('<i></i>').addClass('fa-regular fa-right-left gr sm').attr('title', 'Автопереход')
const btnStart = $('<button>Старт</button>').addClass('btn btn-cs')
const btnPause = $('<button>Пауза</button>').addClass('btn btn-cs').prop('disabled', true)

iconTime.on('click', function () {
	$(this).toggleClass('fa-regular fa-solid gr bl')
	if (timeInput.hasClass('animate-out')) {
		timeInput.removeClass('animate-out').addClass('animate-in').css('display', 'flex')
	} else {
		timeInput.removeClass('animate-in').addClass('animate-out')
		timeInput.one('animationend', function () {
			if ($(this).hasClass('animate-out')) {
				$(this).css('display', 'none')
			}
		})
	}
})

listPatch.on('click', function () {
	$(this).toggleClass('fa-regular fa-solid gr bl')
	if (patchContainer.hasClass('animate-out')) {
		patchContainer.removeClass('animate-out').addClass('animate-in').css('display', 'flex')
	} else {
		patchContainer.removeClass('animate-in').addClass('animate-out')
		patchContainer.one('animationend', function () {
			if ($(this).hasClass('animate-out')) {
				$(this).css('display', 'none')
			}
		})
	}
})

iconArrowUp.on('click', function () {
	if (!$(this).hasClass('fa-solid')) {
		$(this).addClass('fa-solid bl').removeClass('fa-regular gr')
		iconArrowDown.removeClass('fa-solid bl').addClass('fa-regular gr')
		localStorage.setItem('clickDirection', 'up')
	}
	toastr.info('Включена проверка снизу вверх.')
})

iconArrowDown.on('click', function () {
	if (!$(this).hasClass('fa-solid')) {
		$(this).addClass('fa-solid bl').removeClass('fa-regular gr')
		iconArrowUp.removeClass('fa-solid bl').addClass('fa-regular gr')
		localStorage.setItem('clickDirection', 'down')
	}
	toastr.info('Включена проверка сверху вниз.')
})

iconAutoPages.on('click', function () {
	autoPagination = $(this).toggleClass('fa-regular fa-solid gr bl').hasClass('fa-solid')
	localStorage.setItem('autoPagination', autoPagination)
	toastr.info(`Автопереход между страницами ${autoPagination ? 'включен' : 'выключен'}.`)
})

timeInput.on('input', function () {
	clickDelay = $(this).val()
	localStorage.setItem('clickDelay', clickDelay)
})

btnStart.on('click', function () {
	$(this).prop('disabled', true)
	btnPause.prop('disabled', false)
	pauseClicked = false
	const lastDirection = localStorage.getItem('clickDirection') || 'down'
	if (lastDirection === 'up') {
		clickTrFromBottomToTopWithDelay()
	} else {
		clickTrFromTopToBottomWithDelay()
	}
})

btnPause.on('click', function () {
	$(this).prop('disabled', true)
	btnStart.prop('disabled', false)
	pauseClicked = true
	clearTimeout(timeout)
})

function resetIndex() {
	pauseClicked = true
	clearTimeout(timeout)
	currentIndex = -1
	btnStart.prop('disabled', false)
	btnPause.prop('disabled', true)
}

function clickTrFromBottomToTopWithDelay() {
	let trList = $('table[data-bind="foreach: currentTrades"] tr')
	let lastIndex = trList.length - 1
	let delay = parseInt(clickDelay) || 1000

	function clickNextTr(index) {
		if (index < 0) {
			navigateToPreviousPage()
			return
		}
		if (pauseClicked) return
		let tr = trList.eq(index)
		tr.click()
		currentIndex = index
		timeout = setTimeout(function () {
			clickNextTr(index - 1)
		}, delay)
	}

	clickNextTr(currentIndex === -1 ? lastIndex : currentIndex)
}

function clickTrFromTopToBottomWithDelay() {
	let trList = $('table[data-bind="foreach: currentTrades"] tr')
	let lastIndex = trList.length - 1
	let delay = parseInt(clickDelay) || 1000

	function clickNextTr(index) {
		if (index > lastIndex) {
			navigateToNextPage()
			return
		}
		if (pauseClicked) return
		let tr = trList.eq(index)
		tr.click()
		currentIndex = index
		timeout = setTimeout(function () {
			clickNextTr(index + 1)
		}, delay)
	}

	clickNextTr(currentIndex === -1 ? 0 : currentIndex)
}

function navigateToNextPage() {
	if (!autoPagination) {
		resetIndex()
		return
	}

	const nextPage = currentPage + 1
	const paginator = document.querySelector('ul[data-bind="foreach: $root.paginator().urls"]')
	const nextPageElements = paginator.querySelectorAll('li')
	let nextPageElement = null

	nextPageElements.forEach(function (element) {
		const a = element.querySelector('a')
		if (a && parseInt(a.textContent) === nextPage) {
			nextPageElement = a
		}
	})

	if (nextPageElement) {
		nextPageElement.click()
		currentPage = nextPage
	} else {
		resetIndex()
	}
}

function navigateToPreviousPage() {
	if (!autoPagination) {
		resetIndex()
		return
	}

	const prevPage = currentPage - 1
	const paginator = document.querySelector('ul[data-bind="foreach: $root.paginator().urls"]')
	const prevPageElements = paginator.querySelectorAll('li')
	let prevPageElement = null

	prevPageElements.forEach(function (element) {
		const a = element.querySelector('a')
		if (a && parseInt(a.textContent) === prevPage) {
			prevPageElement = a
		}
	})

	if (prevPageElement) {
		prevPageElement.click()
		currentPage = prevPage
	} else {
		resetIndex()
	}
}

$(document).on('click', '[data-bind="click: $root.newSearch"]', resetIndex)
$(document).on('click', '[data-bind="text: page, click: $root.changePageTrades"]', resetIndex)

$(document).keydown(function (event) {
	if (event.altKey && event.key === '1') {
		console.log('on')
		if (btnStart.prop('disabled') === false) {
			btnStart.click()
		} else if (isPaused) {
			btnPause.prop('disabled', false)
			btnStart.prop('disabled', true)
			isPaused = false
			pauseClicked = false
			const lastDirection = localStorage.getItem('clickDirection') || 'down'
			if (lastDirection === 'up') {
				clickTrFromBottomToTopWithDelay()
			} else {
				clickTrFromTopToBottomWithDelay()
			}
		}
	}
	if (event.altKey && event.key === '2') {
		console.log('off')
		if (btnPause.prop('disabled') === false) {
			btnPause.click()
		} else if (!isPaused) {
			btnStart.prop('disabled', false)
			btnPause.prop('disabled', true)
			isPaused = true
			pauseClicked = true
			clearTimeout(timeout)
		}
	}
})

const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			if (container) {
				const tradesSection = $('#tradesSection')
				container.css('display', tradesSection.length ? 'flex' : 'none')
			}
		}
	}
})

const pageContent = document.getElementById('pageContent')
observer.observe(pageContent, { childList: true, subtree: true })

$('body').append(container)
patchContainer.append(iconArrowUp)
patchContainer.append(iconArrowDown)
patchContainer.append(iconAutoPages)

container.append(timeInput)
container.append(iconTime)
container.append(patchContainer)
container.append(listPatch)
container.append(iconInfo)

container.append(btnStart)
container.append(btnPause)

$(document).ready(function () {
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

	const arrBall = [['1 - Монстробол', '2 - Гритбол', '3 - Мастербол', '4 - Ультрабол', '5 - Люксбол', '6 - Фастбол', '7 - Френдбол', '8 - Левелбол', '9 - Лавбол', '10 - Лурбол', '11 - Таймербол', '12 - Нестбол', '13 - Даркбол', '14 - Лайтбол', '15 - Новичка', '16 - Трансбол', '18 - Супердаркбол', '30 - Монстробол Браконьера', '101 - Багбол', '102 - Блэкбол', '103 - Драгонбол', '104 - Электробол', '105 - Файтбол', '106 - Фаербол', '107 - Флайбол', '108 - Гостбол', '109 - Грасбол', '110 - Граундбол', '111 - Айсбол', '112 - Нормобол', '113 - Токсикбол', '114 - Псибол', '115 - Стоунбол', '116 - Стилбол', '117 - Дайвбол']]

	const tooltipsMemoTM = {}
	const tooltipsBall = {}

	function createTooltip($node, text) {
		$node.find('.tooltips').remove()
		$('<div>').addClass('tooltips').text(text).appendTo($node)
	}

	function handleMutation(mutationsList) {
		mutationsList.forEach((mutation) => {
			if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'data-bind')) {
				const nodes = mutation.addedNodes.length > 0 ? mutation.addedNodes : [mutation.target]
				$(nodes).each(function () {
					const $node = $(this)
					if ($node.hasClass('trade-card')) {
						const titleText = $node.find('[data-bind="text: itemTitle"]').text().trim()
						const memoText = $node.find('span[data-bind="text: memoFormated"]').text().trim()
						if (titleText === 'Тренировочная Машина') {
							const [key] = memoText.split(' - ')
							const tooltipText = tooltipsMemoTM[key]
							if (tooltipText) {
								createTooltip($node, tooltipText)
							}
						} else if (titleText === 'Графитовый колокольчик') {
							$('tr.active').each(function () {
								const $row = $(this)
								const datText = $row.find('span[data-bind="text: dat"]').text()
								if (datText) {
									const burnTime = (new Date(datText) - new Date(memoText * 1000)) / (1000 * 60 * 60 * 24)
									const percentRemaining = ((burnTime / 31) * 100).toFixed(2)
									const positivePercentRemaining = Math.abs(percentRemaining)
									createTooltip($node, `${positivePercentRemaining}%`)
								}
							})
						} else if (titleText === 'Монстробол') {
							const [key] = memoText.split(' - ')
							const tooltipText = tooltipsBall[key]
							if (tooltipText) {
								createTooltip($node, tooltipText)
							}
						}
					}
				})
			}
		})
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
})



$(document).ready(function () {
	$('[title]').tooltipster()
	$.ajax({
		url: 'https://59c87fe2c473d859.mokky.dev/Update',
		method: 'GET',
		success: function (response) {
			const tooltipContent = generateTooltipContent(response)
			iconInfo.tooltipster({
				content: $(tooltipContent),
				contentAsHTML: true,
				interactive: true,
			})
		},
		error: function () {
			console.error('Не удалось загрузить данные для подсказки')
		},
	})

	function generateTooltipContent(data) {
		let content = '<table>'

		const filteredData = data.filter((item) => item.version <= localVersion)

		filteredData.forEach((item) => {
			content += `<tr class="tr-line"><td>${item.date}</td><td>${item.text}</td></tr>`
		})

		content += '</table>'
		return content
	}

})

$.ajax({
	url: 'https://59c87fe2c473d859.mokky.dev/check',
	type: 'GET',
	success: function (response) {
		let Version = null

		response.forEach((obj) => {
			if (obj.version) {
				Version = obj.version
			}
		})

		if (Version && Version !== localVersion) {
			response.forEach((obj) => {
				toastr.warning(`${obj.title}\n${obj.txt}\n<a href="https://github.com/katahu/PoliceAC/archive/refs/heads/main.zip" class="link-update">Скачать</>`)
			})
		}
	},
})
toastr.options = {
	closeButton: true,
	debug: false,
	newestOnTop: false,
	progressBar: false,
	positionClass: 'my-custom-position',
	preventDuplicates: false,
	onclick: null,
	showDuration: '300',
	hideDuration: '1000',
	timeOut: '5000',
	extendedTimeOut: '1000',
	showEasing: 'swing',
	hideEasing: 'linear',
	showMethod: 'fadeIn',
	hideMethod: 'fadeOut',
}
