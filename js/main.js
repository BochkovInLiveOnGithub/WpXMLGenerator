/**
 * Назначение
 * Генератор файла.xml под Wordpress Importer для упрощения наполнения сайта
 * ВАЖНО Скопировать атрибуты rss из файла экспорта в поле Типы данных 
 * Скопировать <item> из файла экспорта в поле Образец <item>
 * Нажать запуск. JS считает поля из поля <item> и создаст табы
 * Пройти по табам и наполнить поля инфой
 * Нажать кнопку Скачать для загрузки готового документа
 */
jQuery(document).ready(function($) {	
		
	let
		rawItem,
		tabsContainer	= $('#v-pills-tab'),
		tabContentContainer	= $('#v-pills-tabContent'),
		modalPreview	=	$('#modalPreview'),
		separator	=	$('#separator'),
		tagStart	=	$('#tag-start'),
		tagEnd	=	$('#tag-end'),
		tags,
		tabsData,
		sortTabsData,
		tabsDataMaxLength,
		replace,
		docHead	=	`<?xml version="1.0" encoding="UTF-8" ?>
		<rss version="2.0" 
		xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
		xmlns:content="http://purl.org/rss/1.0/modules/content/"
		xmlns:wfw="http://wellformedweb.org/CommentAPI/"
		xmlns:dc="http://purl.org/dc/elements/1.1/"
		xmlns:wp="http://wordpress.org/export/1.2/">
		<channel>
		<language>ru-RU</language>
		<wp:wxr_version>1.2</wp:wxr_version>`,
		readyItems,
		docBottom	=	`</channel>
		</rss>`,
		finalXml,
		docName = $('.docName'),
		errors	=	{
			item: 'Не найден образец <item> ',
			tags:	'Не указаны метки для замены',
			preview: 'Нечего показывать',
		};
	/*function showError() {
		//Проверочки
		if(rawItem == '') {
			console.log(errors['item']);
			return;
		}
		if(tags == null) {
			console.log(errors['tags']);
			return;
		}
	}	*/
	//После нажатия Далее
	function createTabs() {
			rawItem	= $('#xmlItemExample').val();
		//	rawItem = rawItem.replace(/^\s+/g,'');
			tags = rawItem.match(/#[a-zA-Zа-яА-Я0-9_]+/g);
			
			//Проверочки
			if(rawItem == '') {
				console.log(errors['item']);
				return;
			}
			if(tags == null) {
				console.log(errors['tags']);
				return;
			}
			//console.log(rawItem);
			
			//Удалить табы, если они уже есть
			if(tabsContainer.children() || tabContentContainer.children()) {
				tabsContainer.empty();
				tabContentContainer.empty();
				
			}
	
			tags.forEach((tag, i) => {
				tag = tag.replace('#', '');
				//console.log(tag);
				tabsContainer.append(`
				<button class="nav-link ${(i == 0)? 'active' : ''}" id="v-pills-${tag}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${tag}" type="button" role="tab" aria-controls="v-pills-${tag}" aria-selected="true">${tag}</button>
				`);
				tabContentContainer.append(`
				<div class="tab-pane h-100 bg-dark-subtle fade show ${(i == 0)? 'active' : ''}" id="v-pills-${tag}" role="tabpanel" aria-labelledby="v-pills-${tag}-tab" tabindex="0">
					<div class="col-4 p-2">
						<label for="${tag}-textarea">${tag}</label>
						<textarea id="${tag}-textarea" class="form-control" data-fieldname="#${tag}" style="height:300px"></textarea>
					</div>
				</div>
				
				`);
			});
	
	}
	//Создаем новые данные
	function generateData() {
		
		tabsData	=	{};
		readyItems	=	[];
		//Собрать поля
		$('#v-pills-tabContent textarea').each(function(){
			//console.log($(this).val());
			
			let fieldname = $(this).data('fieldname'),
				textareaVal = $(this).val().split(separator.val()	?	separator.val()	:	'\n');
				//console.log(separator.val());
				
					tabsData[fieldname] = textareaVal;
				
			
		});
		//console.log(tabsData);
		//Отсортировать поля
		tabsDataMaxLength	=	0;
		sortTabsData	=	[];
		for(let key in tabsData) {
			if(tabsData[key].length > tabsDataMaxLength) {
				tabsDataMaxLength = tabsData[key].length;
			}
			
		}
		//console.log(tabsDataMaxLength);
		for(let i = 0; i < tabsDataMaxLength; i++) {
			let tempObj = {};
			for(let key in tabsData) {
				
				if(typeof tabsData[key][i] == 'undefined') {
					tabsData[key][i] = '';
				}
				tempObj[key] = tabsData[key][i];				
				
			}
			
			sortTabsData.push(tempObj);
		}
		console.log(sortTabsData);
		//Провести поиск и замену
		sortTabsData.forEach(sortData => {
			replace = sortData;
			let re = new RegExp(Object.keys(replace).join('|'), 'g');
			let newText = rawItem.replace(re, (match) => replace[match]);
			readyItems.push(newText);
			
		});
		console.log(readyItems);
		return readyItems;
	}
	//Посмотреть превью файла
	function showPreviewCode() {
		generateData();
		//console.log(readyItems);
		let modalBody = modalPreview.find('.modal-body');
		modalBody.text('');

		/*readyItems.forEach(item => {
			
			modalBody.text(modalBody.text() + item);
		});*/
	}
	//Скачать файл
	function downloadNewDoc() {
		generateData();
		readyItems.unshift(docHead);
		readyItems.push(docBottom);
		let a = document.createElement("a");
		let file = new Blob([readyItems.join('')], {type: 'application/xml'});
		a.href = URL.createObjectURL(file);
		
		a.download = `${docName.val() ? docName.val()	: 'WordpressImportFile'}.xml`;
		a.click();
		URL.revokeObjectURL(a.href);
	}
	$('#runTabs').on('click', createTabs);
	$('#runPreview').on('click', showPreviewCode);
	$('.downloadXML').on('click', downloadNewDoc);

});