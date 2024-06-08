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
	/*let xmlItemExample = $('#xmlItemExample').val(), 
		tags, 
		data, 
		docHead,
		readyItems = [],
		docBottom;*/
		
	let
		rawItem,
		tabsContainer	= $('#v-pills-tab'),
		tabContentContainer	= $('#v-pills-tabContent'),
		modalPreview	=	$('#modalPreview'),
		tags,
		tabsData,
		sortTabsData,
		tabsDataMaxLength	= 0,
		replace,
		docHead	=	`<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"
		xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
		xmlns:content="http://purl.org/rss/1.0/modules/content/"
		xmlns:wfw="http://wellformedweb.org/CommentAPI/"
		xmlns:dc="http://purl.org/dc/elements/1.1/"
		xmlns:wp="http://wordpress.org/export/1.2/">`,
		readyItems	=	[],
		docBottom	=	`</channel></rss>`,
		finalXml,
		errors	=	{
			item: 'Не найден образец <item> ',
			tags:	'Не указаны метки для замены',
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
			rawItem = rawItem.replace(/\s/g,'');
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
				<div class="tab-pane bg-dark-subtle fade show ${(i == 0)? 'active' : ''}" id="v-pills-${tag}" role="tabpanel" aria-labelledby="v-pills-${tag}-tab" tabindex="0">
					<div class="col-4 p-2">
						<label for="${tag}-textarea">${tag}</label>
						<textarea id="${tag}-textarea" class="form-control" data-fieldname="#${tag}"></textarea>
					</div>
				</div>
				
				`);
			});
	
	}
	
	function generateData() {
		//Собрать поля
		tabsData	=	{};
		$('#v-pills-tabContent textarea').each(function(){
			let fieldname = $(this).data('fieldname'),
				textareaVal = $(this).val().split('\n');
				
			tabsData[fieldname] = textareaVal;
		});
		//Отсортировать поля
		sortTabsData	=	[];
		for(let key in tabsData) {
			if(tabsData[key].length > tabsDataMaxLength) {
				tabsDataMaxLength = tabsData[key].length;
			}
			
		}
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
		
		sortTabsData.forEach(sortData => {
			replace = sortData;
		});
		console.log(replace);
		//return tabsData;
	}
	function ShowPreviewCode() {
		generateData();
	}
	function downloadNewDoc() {
		generateData();
	}
	$('#runTabs').on('click', createTabs);
	$('#runPreview').on('click', ShowPreviewCode);
	//$('#downloadXML').on('click', downloadNewDoc);
	/* 
		
		//После нажатия Предварительный просмотр
		$('#runPreview').on('click', function() {			
			data = {};
			$('#v-pills-tabContent textarea').each(function(){
				let fieldname = $(this).data('fieldname'),
					textareaVal = $(this).val().split('\n');
					
			data[fieldname] = textareaVal;			
			
			
			});

		});
		
		
	});*/
	//После нажатия Скачать


});