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
	$('#runTabs').on('click', function() {
		let xmlItemExample = $('#xmlItemExample').val(),
	//	varExample = $('#varExample').val()
		tabsContainer	=	$('#v-pills-tab'),
		tabContentContainer	=	$('#v-pills-tabContent'),
		tags = xmlItemExample.match(/#[a-zA-Zа-яА-Я0-9_]+/g);

		tags.forEach((tag, i) => {
			tag = tag.replace('#', '');
			tabsContainer.append(`
			<button class="nav-link ${(i == 0)? 'active' : ''}" id="v-pills-${tag}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${tag}" type="button" role="tab" aria-controls="v-pills-${tag}" aria-selected="true">${tag}</button>
			`);
			tabContentContainer.append(`
			<div class="tab-pane fade show ${(i == 0)? 'active' : ''}" id="v-pills-${tag}" role="tabpanel" aria-labelledby="v-pills-${tag}-tab" tabindex="0">
			<div class="col-12">
			<label for="${tag}-textarea">${tag}</label>
			<textarea id="${tag}-textarea" class="form-control"></textarea>
			</div>
			</div>
			
			`);
		});
		let textareas = $('.tab-pane textarea');
		console.log(textareas);
	});



});