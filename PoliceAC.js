let localVersion = '0.6'
let pauseClicked = false
let timeout = null
let currentIndex = -1
let isPaused = false
let currentPage = 1
let savedDirection = 'down'
let autoPagination = false
let clickDelay = '1000'
let tooltips = {}
let observerS

$(document).ready(function () {
	savedDirection = localStorage.getItem('clickDirection') || 'up'
	autoPagination = localStorage.getItem('autoPagination') === 'true'
	clickDelay = localStorage.getItem('clickDelay') || '1000'

	updateUI()

	if (autoPagination) {
		iconAutoPages.addClass('fa-solid bl').removeClass('fa-regular gr')
	} else {
		iconAutoPages.removeClass('fa-solid bl').addClass('fa-regular gr')
	}

	$('[title]').tooltipster()
	fetchData('https://59c87fe2c473d859.mokky.dev/Update', processUpdateResponse)
	fetchData('https://59c87fe2c473d859.mokky.dev/check', processVersionCheck)
	fetchData('https://59c87fe2c473d859.mokky.dev/arrTO', processJsonArray)
	observeUserTabsSection()
	observeMainSection()
})

function updateUI() {
	if (savedDirection === 'up') {
		iconArrowUp.addClass('fa-solid bl').removeClass('fa-regular gr')
		iconArrowDown.removeClass('fa-solid bl').addClass('fa-regular gr')
	} else {
		iconArrowDown.addClass('fa-solid bl').removeClass('fa-regular gr')
		iconArrowUp.removeClass('fa-solid bl').addClass('fa-regular gr')
	}
}

function toggleElementVisibility(element) {
	if (element.hasClass('animate-out')) {
		element.removeClass('animate-out').addClass('animate-in').css('display', 'flex')
	} else {
		element.removeClass('animate-in').addClass('animate-out')
		element.one('animationend', function () {
			if ($(this).hasClass('animate-out')) {
				$(this).css('display', 'none')
			}
		})
	}
}

function resetIndex() {
	pauseClicked = true
	clearTimeout(timeout)
	currentIndex = -1
	btnStart.prop('disabled', false)
	btnPause.prop('disabled', true)
}

function clickTrWithDelay(fromBottom = false) {
	const trList = $('table[data-bind="foreach: currentTrades"] tr')
	const lastIndex = trList.length - 1
	const delay = parseInt(clickDelay) || 1000

	function clickNextTr(index) {
		if (index < 0 || index > lastIndex) {
			fromBottom ? navigateToPreviousPage() : navigateToNextPage()
			return
		}
		if (pauseClicked) return
		const tr = trList.eq(index)
		tr.click()
		currentIndex = index
		timeout = setTimeout(function () {
			clickNextTr(fromBottom ? index - 1 : index + 1)
		}, delay)
	}

	clickNextTr(currentIndex === -1 ? (fromBottom ? lastIndex : 0) : currentIndex)
}

function clickTrFromBottomToTopWithDelay() {
	clickTrWithDelay(true)
}

function clickTrFromTopToBottomWithDelay() {
	clickTrWithDelay(false)
}

function navigateToPage(step, forward) {
	const paginator = document.querySelector('ul[data-bind="foreach: $root.paginator().urls"]')
	const activeElement = paginator.querySelector('li.active')

	if (!activeElement) {
		resetIndex()
		return
	}

	let targetElement = activeElement
	for (let i = 0; i < step; i++) {
		targetElement = forward ? targetElement.nextElementSibling : targetElement.previousElementSibling
		if (!targetElement) {
			resetIndex()
			return
		}
	}

	const a = targetElement.querySelector('a')
	if (a) {
		a.click()
		currentPage = parseInt(a.textContent)
	} else {
		resetIndex()
	}
}

function navigateToNextPage(step = 1) {
	if (!autoPagination) {
		resetIndex()
		return
	}
	navigateToPage(step, true)
}

function navigateToPreviousPage(step = 1) {
	if (!autoPagination) {
		resetIndex()
		return
	}
	navigateToPage(step, false)
}

function startAutoClick() {
	if (btnStart.prop('disabled') === false) {
		btnStart.click()
	} else if (isPaused) {
		resumeAutoClick()
	}
}

function stopAutoClick() {
	if (btnPause.prop('disabled') === false) {
		btnPause.click()
	} else if (!isPaused) {
		pauseAutoClick()
	}
}

function resumeAutoClick() {
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

function pauseAutoClick() {
	btnStart.prop('disabled', false)
	btnPause.prop('disabled', true)
	isPaused = true
	pauseClicked = true
	clearTimeout(timeout)
}

function handleArrowKeys(event) {
	if (event.key === 'ArrowDown') {
		event.preventDefault()
		moveToNextTr()
	}
	if (event.key === 'ArrowUp') {
		event.preventDefault()
		moveToPreviousTr()
	}
}

function moveToNextTr() {
	const trList = $('table[data-bind="foreach: currentTrades"] tr')
	const lastIndex = trList.length - 1
	if (currentIndex < lastIndex) {
		currentIndex++
		trList.eq(currentIndex).click()
	} else {
		navigateToNextPage()
	}
}

function moveToPreviousTr() {
	const trList = $('table[data-bind="foreach: currentTrades"] tr')
	if (currentIndex > 0) {
		currentIndex--
		trList.eq(currentIndex).click()
	} else {
		navigateToPreviousPage()
	}
}

function fetchData(url, successCallback) {
	$.ajax({
		url,
		method: 'GET',
		success: successCallback,
		error: function () {
			console.error(`Не удалось загрузить данные с ${url}`)
		},
	})
}

function processUpdateResponse(response) {
	const tooltipContent = generateTooltipContent(response)
	iconInfo.tooltipster({
		content: $(tooltipContent),
		contentAsHTML: true,
		interactive: true,
	})
}

function generateTooltipContent(data) {
	let content = '<table>'
	const filteredData = data.filter((item) => item.version <= localVersion)
	filteredData.forEach((item) => {
		content += `<tr class="tr-line"><td>${item.date}</td><td>${item.text}</td></tr>`
	})
	content += '</table>'
	return content
}

function processVersionCheck(response) {
	let Version = null
	response.forEach((obj) => {
		if (obj.version) {
			Version = obj.version
		}
	})

	if (Version && Version !== localVersion) {
		response.forEach((obj) => {
			toastr.warning(`${obj.title}\n${obj.txt}\n<a href="https://github.com/katahu/PoliceAC/archive/refs/heads/main.zip" style="text-decoration: underline !important;">Скачать</a>`)
		})
	}
}

function processJsonArray(jsonArray) {
	jsonArray.forEach((categoryObj) => {
		Object.entries(categoryObj).forEach(([category, items]) => {
			tooltips[category] = {}
			items.forEach((item) => {
				const [key, ...rest] = item.split(' - ')
				tooltips[category][key] = rest.join(' - ')
			})
		})
	})
	observeMutations()
}

function appendTooltipText($node, text) {
	const currentText = $node.html().trim()
	if (!currentText.includes(text)) {
		$node.html(`${currentText} - <strong>${text}</strong>`)
	}
}

function debounce(func, wait) {
	let timeout
	return function (...args) {
		const later = () => {
			clearTimeout(timeout)
			func.apply(this, args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

function processTableRows($rows) {
	$rows.each(function () {
		const $row = $(this)
		const $columns = $row.find('td')

		if ($columns.length === 5) {
			const $thirdTd = $columns.eq(2)
			const $fourthTd = $columns.eq(3)

			const $thirdSpan = $thirdTd.find('[data-bind="html: typeof rowText == \'function\' ? rowText($parent) : $parent[rowText]"]')
			const thirdTdText = $thirdSpan.text().trim()

			const categories = ['Тренировочная Машина', 'Конфета', 'Игральная Карта', 'Монстробол', 'Окаменелость', 'Пилюля', 'Витамины', 'Графитовый колокольчик']

			if (categories.includes(thirdTdText)) {
				const key = $fourthTd.find('span[data-bind]').text().trim()

				if (thirdTdText === 'Окаменелость' && key.length === 5) {
					const arrayKey = key.slice(0, 3)
					const percent = key.slice(3)
					const tooltipText = tooltips['Яйцо']?.[arrayKey]

					if (tooltipText) {
						appendTooltipText($thirdSpan, `${tooltipText} ${percent}%`)
					}
				} else if (thirdTdText === 'Пилюля' || thirdTdText === 'Витамины') {
					const tooltipText = tooltips['Пилюля']?.[key]

					if (tooltipText) {
						appendTooltipText($thirdSpan, tooltipText)
					}
				} else if (thirdTdText === 'Графитовый колокольчик') {
					const memoText = key
					const burnTime = (new Date() - new Date(memoText * 1000)) / (1000 * 60 * 60 * 24)
					const percentRemaining = ((burnTime / 31) * 100).toFixed(2)
					const positivePercentRemaining = Math.abs(percentRemaining)
					appendTooltipText($thirdSpan, `${positivePercentRemaining}%`)
				} else {
					const tooltipText = tooltips[thirdTdText]?.[key]
					if (tooltipText) {
						appendTooltipText($thirdSpan, tooltipText)
					}
				}
			}
		}
	})
}

const processTableRowsDebounced = debounce(processTableRows, 300)

function handleMutationS(mutationsList) {
	const $nodesToProcess = []
	mutationsList.forEach((mutation) => {
		if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'data-bind')) {
			const nodes = mutation.addedNodes.length > 0 ? mutation.addedNodes : [mutation.target]
			$nodesToProcess.push(...nodes)
		}
	})
	const $uniqueRows = $(Array.from(new Set($nodesToProcess.map((node) => $(node).closest('tr').get(0)))))
	processTableRowsDebounced($uniqueRows)
}

function observeUserTabsSection() {
	const userTabsSection = document.getElementById('userTabsSection')
	if (userTabsSection) {
		if (!observerS) {
			observerS = new MutationObserver(handleMutationS)
		}
		observerS.observe(userTabsSection, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['data-bind'],
		})
		processTableRows($(userTabsSection).find('tr'))
	} else if (observerS) {
		observerS.disconnect()
	}
}

function observeMainSection() {
	const observerMain = new MutationObserver(observeUserTabsSection)
	observerMain.observe(document.body, {
		childList: true,
		subtree: true,
	})
}

function observeMutations() {
	const observer = new MutationObserver(handleMutation)
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['data-bind'],
	})
}

function handleMutation(mutationsList) {
	mutationsList.forEach((mutation) => {
		if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'data-bind')) {
			const nodes = mutation.addedNodes.length > 0 ? mutation.addedNodes : [mutation.target]
			nodes.forEach((node) => {
				const $node = $(node)
				if ($node.hasClass('trade-card')) {
					processTradeCard($node)
				}
			})
		}
	})
}

function processTradeCard($node) {
	const titleText = $node.find('[data-bind="text: itemTitle"]').text().trim()
	const itemTitle = $node.find("[data-bind=\"text: itemTitle() + ' ' + '#' + app.addnuls(eggSp_id(), 3) + ' ' + eggPokename()\"]").text().trim()
	let memoText = $node.find('[data-bind="text: memoFormated"]').text().trim()
	const amount = $node.find('[data-bind="triadtext: amount"]').text().trim()

	if (!memoText && (titleText === 'Пилюля' || titleText === 'Витамины')) {
		memoText = '0'
	}

	const [key] = memoText.split(' - ')
	let tooltipText = ''

	if (titleText === 'Пилюля' || titleText === 'Витамины') {
		tooltipText = tooltips['Пилюля']?.[key]
		if (titleText === 'Пилюля') {
			createTooltip($node, `<strong>п.</strong>${tooltipText} x<strong>${amount}</strong>`)
		} else if (titleText === 'Витамины') {
			createTooltip($node, `<strong>в.</strong>${tooltipText} x<strong>${amount}</strong>`)
		}
	} else if (titleText === 'Графитовый колокольчик') {
		processGraphiteBell($node, memoText)
	} else if (titleText === 'Окаменелость') {
		processFossil($node, memoText)
	} else if (titleText === 'Игрушка') {
		tooltipText = tooltips['Яйцо']?.[key]
		if (tooltipText) {
			createTooltip($node, `игрушка <strong>${tooltipText}</strong>`)
		}
	} else if (itemTitle.includes('Яйцо')) {
		tooltipText = tooltips['Яйцо']?.[key]
		if (tooltipText) {
			createTooltip($node, `${tooltipText}`)
		}
	} else {
		tooltipText = tooltips[titleText]?.[key]
		if (tooltipText) {
			createTooltip($node, `${tooltipText} x<strong>${amount}</strong>`)
		}
	}
}

function processGraphiteBell($node, memoText) {
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
}

function processFossil($node, memoText) {
	const eggCode = memoText.slice(0, 3)
	const eggPercentage = memoText.slice(-2)
	const eggName = tooltips['Яйцо']?.[eggCode]
	if (eggName) {
		const tooltipText = `${eggName} ${eggPercentage}%`
		createTooltip($node, tooltipText)
	}
}

function createTooltip($node, text) {
	$node.find('.tooltips').remove()
	$('<div>').addClass('tooltips').html(text).appendTo($node)
}

// UI
const container = $('<div></div>').addClass('Pcontainer')
const timeInput = $('<input type="text" placeholder="Время задержки (мс)" autocomplete="off"></input>').attr('id', 'animate-inp').addClass('animate-out').css('display', 'none')
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
	toggleElementVisibility(timeInput)
})

listPatch.on('click', function () {
	$(this).toggleClass('fa-regular fa-solid gr bl')
	toggleElementVisibility(patchContainer)
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

$(document).on('click', '[data-bind="click: $root.newSearch"]', resetIndex)
$(document).on('click', '[data-bind="text: page, click: $root.changePageTrades"]', resetIndex)

$(document).keydown(function (event) {
	if (event.altKey && event.key === '1') {
		startAutoClick()
	}
	if (event.altKey && event.key === '2') {
		stopAutoClick()
	}
	if (pauseClicked) {
		handleArrowKeys(event)
	}
})

const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.type === 'childList') {
			const tradesSection = $('#tradesSection')
			container.css('display', tradesSection.length ? 'flex' : 'none')
		}
	}
})

const pageContent = document.getElementById('pageContent')
observer.observe(pageContent, { childList: true, subtree: true })

$('body').append(container)
patchContainer.append(iconArrowUp, iconArrowDown, iconAutoPages)
container.append(timeInput, iconTime, patchContainer, listPatch, iconInfo, btnStart, btnPause)

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
