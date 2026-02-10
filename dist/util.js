function onLoadDemoData() {
	$("#file").val(null);
	fileList = [demoData];
	fileMetadata = [{
		name: 'Demo Data',
		minDate: '2024-12-24',
		maxDate: '2024-12-27',
		orderCount: demoData.orders.length
	}];
	renderAll(combineData(fileList));
	file = combineData(fileList);
	renderProfileFiles();
	$('#file').attr("data-title", filePlaceholder + '\nZobrazuji demo data');
}

function extractDateString(createdAt) {
	// Handle format: date:"2026-02-10 13:24:56"  timezone:"Europe/Prague"
	// Also handle normal format: 2026-02-10 13:24:56 or 2020-06-21 15:17:36
	if (typeof createdAt !== 'string') return null;
	
	const dateMatch = createdAt.match(/date:"([^"]+)"/);
	if (dateMatch) {
		return dateMatch[1].substring(0, 10); // Extract YYYY-MM-DD
	}
	// Return first 10 chars for normal format (YYYY-MM-DD)
	return createdAt.substring(0, 10);
}

function onFileChange(event) {
	const files = event.target.files;
	let filesLoaded = 0;
	fileList = [];
	fileMetadata = [];

	if (files.length === 0) {
		return;
	}

	Array.from(files).forEach((fileObj, index) => {
		const reader = new FileReader();
		reader.onload = function(e) {
			try {
				const parsedData = JSON.parse(e.target.result);
				if (!parsedData.profile || !parsedData.orders || !_.isArray(parsedData.orders)) {
					console.error('Invalid structure in file:', fileObj.name, parsedData);
					return;
				}
				fileList.push(parsedData);
				
				// Calculate min and max dates for this file
				if (parsedData.orders.length > 0) {
					const dates = parsedData.orders.map(o => extractDateString(o.created_at)).filter(d => d).sort();
					const minDate = dates[0];
					const maxDate = dates[dates.length - 1];
					fileMetadata.push({
						name: fileObj.name,
						minDate: minDate,
						maxDate: maxDate,
						orderCount: parsedData.orders.length
					});
				}

				filesLoaded++;
				if (filesLoaded === files.length) {
					// All files loaded
					const combinedData = combineData(fileList);
					renderAll(combinedData);
					file = combinedData;
					renderProfileFiles();
				}
			} catch (error) {
				alert("Chyba při zpracování souboru: " + fileObj.name + ". Podrobnosti v konzoli.")
				console.error('Error parsing the JSON file', fileObj.name, error);
			}
		};
		reader.readAsText(fileObj);
	});
}

function renderAll(file) {
	// display profile data
	renderProfile(file.profile);
	renderAddresses(file.addresses);
	renderCosts(file.orders);
	renderTables(file.orders);
	$("#heatmap").CalendarHeatmap("updateDates", getCalendarData(file.orders));
}

function combineData(fileList) {
	if (fileList.length === 0) {
		return { profile: {}, addresses: [], orders: [] };
	}

	if (fileList.length === 1) {
		return fileList[0];
	}

	// Use first file's profile and addresses as base
	const combined = {
		profile: fileList[0].profile || {},
		addresses: fileList[0].addresses || [],
		orders: []
	};

	// Combine all orders from all files
	fileList.forEach(file => {
		if (file.orders && _.isArray(file.orders)) {
			combined.orders = combined.orders.concat(file.orders);
		}
	});

	// Sort all orders by date
	combined.orders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

	return combined;
}

function renderProfileFiles() {
	const filesHtml = fileMetadata.map(meta => {
		return `<div class="mb-2">
			<strong>${meta.name}</strong>
			<br>
			<small class="text-muted">Objednávek: ${meta.orderCount}, Rozsah: ${meta.minDate} až ${meta.maxDate}</small>
		</div>`;
	}).join('');

	if (fileMetadata.length > 0) {
		$('#files-list').html(filesHtml);
		$('#loaded-files-container').show();
		$('#file').attr("data-title", filePlaceholder + '\nNahraných souborů: ' + fileMetadata.length);
	} else {
		$('#loaded-files-container').hide();
	}
}

function renderProfile(profile = {}) {
	if (!profile) {
		$('#profile .data').text('');
		return;
	}

	const name = profile.first_name + ' ' + profile.last_name;
	$('#profile-name').text(name);
	$('#profile-email').text(profile.email);
	$('#profile-phone').text(profile.phone);
}

function renderAddresses(addresses = []) {
	const text = addresses.map(a => {
		return [a.address, a.postcode, a.city].join(', ');
	})
	$('#profile-addresses').html(text.join('<br>'));
}

function renderCosts(orders = []) {
	if (!orders || !orders.length) {
		$('#costs .data').text('N/A');
		return;
	}

	const total = getTotalCost(orders);
	$('#costs-total').text(total.toLocaleString('cz') + ' Kč');
	$('#costs-avg').text(parseInt(total / orders.length).toLocaleString('cz') + ' Kč');
	$('#orders-total').text(orders.length);
}

function renderTables(orders = []) {
	console.log("clearing tables ...")
	$('#table-restaurants').bootstrapTable('destroy');
	$('#table-price-range').bootstrapTable('destroy');
	$('#table-meals').bootstrapTable('destroy');
	console.log("rendering tables ...")

	const restaurantCount = _.countBy(orders, 'restaurant_name');
	const restaurantCountArray = _(orders)
		.countBy('restaurant_name')
		.keys()
		.map(key => {
			return { restaurant: key, count: restaurantCount[key] }
		})
		.sort((a, b) => a.count > b.count ? -1 : 1)
		.value();

	$('#table-restaurants').bootstrapTable({
		data: restaurantCountArray
	});

	const priceRange = _.countBy(orders, (order) => {
		const ceiled = Math.ceil(order.cart.total / 100) * 100;
		return `${ceiled - 100}-${ceiled}`;
	});
	const priceRangeArray = _.keys(priceRange)
		.map(key => {
			return { range: key, count: priceRange[key] }
		})
		.sort((a, b) => a.range < b.range ? -1 : 1);

	$('#table-price-range').bootstrapTable({
		data: priceRangeArray
	});

	$('#table-meals').bootstrapTable({
		data: getMealsByName(orders)
	});
}

const mealNamesToBeMerged = {
	'SINGLE BIG TASTY BACON VELKÉ MCMENU™': 'SINGLE BIG TASTY BACON VELKÉ MCMENU',
};

function getMealsByName(orders) {
	const meals = _.flatMap(orders, order => order.cart.items);
	const grouped = [];

	meals.forEach(meal => {
		if (mealNamesToBeMerged[meal.name]) {
			meal.name = mealNamesToBeMerged[meal.name];
		}
		const group = grouped[meal.name];
		if (group) {
			group.count += meal.quantity;
			group.total += meal.quantity * meal.price;
		} else {
			grouped[meal.name] = {
				count: meal.quantity,
				total: meal.quantity * meal.price
			}
		}
	});

	const groupedArray = _.keys(grouped).map(key => {
		const group = grouped[key];

		return {
			name: key,
			count: group.count,
			total: group.total
		}
	})
	
	const mealCountsArray = groupedArray
		.map(group => ({ meal: group.name, count: group.count, total: group.total }))
		.sort((a, b) => a.count > b.count ? -1 : 1)
		.slice(0, 20); // Only top 20 most ordered

	return mealCountsArray;
}

function getTotalCost(orders) {
	return orders.reduce((sum, order) => {
		return sum + order.cart.total;
	}, 0);	
}

function getCalendarData(orders) {
	const calendarData = {};
	orders.forEach(order => {
		const date = extractDateString(order.created_at);
		if (!calendarData[date]) {
			calendarData[date] = {
				count: 1,
				date: date,
				total: order.cart.total
			}
		} else {
			calendarData[date].count++;
			calendarData[date].total += order.cart.total;
		}
	})

	return _.values(calendarData);
}

function onMonthLabelClick(evt) {
	const month = $(evt.target).data('month');
	const year = $(evt.target).data('year');
	let orders = (file && file.orders) || [];
	
	if ($(evt.target).parents('.ch-month').hasClass('border-active')) {
		$('.ch-month').removeClass('border-active').removeClass('opacity-50');
	} else {
		// TODO: use moment, not this ugly hack for safari: https://stackoverflow.com/questions/4310953/invalid-date-in-safari
		orders = file && file.orders.filter(order => {
			const dateStr = extractDateString(order.created_at);
			const date = new Date(dateStr.replace(/ /g, "T"));
			return date.getMonth() === month && date.getFullYear() === year;
		}) || [];
		$('.ch-month').removeClass('border-active').addClass('opacity-50');
		$(evt.target).parents('.ch-month').addClass('border-active').removeClass('opacity-50');;
	}

	renderCosts(orders);
	renderTables(orders);
}

const demoData = {
	"profile": {
		"first_name": "John",
		"last_name": "Doe",
		"email": "john.doe@hotmail.com",
		"phone": "+420774298076",
		"phone_valid": true,
		"created_at": "2016-11-23 23:59:59"
	},
	"addresses": [
		{
			"address": "Jump Street 22",
			"country_code": "cz",
			"city": "Hradec Králové",
			"postcode": "503 11",
			"delivery_instructions": "",
			"latitude": 50.2195693,
			"longitude": 15.8061115,
			"created_at": "2021-12-14T10:27:29Z",
			"updated_at": "2022-01-06T10:33:33Z"
		}
	],
	"orders": [
		{
			"address": "Jump Street 22 503 11 Hradec Králové",
			"delivery_instructions": "",
			"country": "cz",
			"restaurant_name": "Avion Čínská restaurace",
			"type": "delivery",
			"cart": {
				"items": [
					{
						"name": "23b Taštičky s krevetovou náplní  4k s（2，3，12）",
						"quantity": 1,
						"price": 79,
						"toppings_price": 0,
						"total_price": 79,
						"toppings": [],
						"special_requests": ""
					},
					{
						"name": "207 Sushi maki - 16ks（2，4，6，10，11，12，）",
						"quantity": 1,
						"price": 189,
						"toppings_price": 0,
						"total_price": 189,
						"toppings": [],
						"special_requests": ""
					},
					{
						"name": "M4c Toufu kung-bao (5,6,12)",
						"quantity": 1,
						"price": 115,
						"toppings_price": 45,
						"total_price": 160,
						"toppings": [
							{
								"name": "Bila ryze",
								"price": 45
							}
						],
						"special_requests": ""
					}
				],
				"vouchers": null,
				"delivery_fee": 29,
				"total": 512
			},
			"created_at": new Date(new Date() - (1000 * 60 * 60 * 24 * 2)).toISOString()
		},
		{
			"address": "Jump Street 22 503 11 Hradec Králové",
			"delivery_instructions": "",
			"country": "cz",
			"restaurant_name": "Choosy Fresh Choice",
			"type": "delivery",
			"cart": {
				"items": [
					{
						"name": "Kuřecí vývar s masem a nudlemi",
						"quantity": 1,
						"price": 39,
						"toppings_price": 0,
						"total_price": 39,
						"toppings": [],
						"special_requests": ""
					},
					{
						"name": "Burrito s hovězím trhaným masem a pečenými paprikami",
						"quantity": 2,
						"price": 109,
						"toppings_price": 0,
						"total_price": 218,
						"toppings": [],
						"special_requests": ""
					}
				],
				"vouchers": null,
				"delivery_fee": 0,
				"total": 287
			},
			"created_at": new Date(new Date() - (1000 * 60 * 60 * 24 * 2)).toISOString()
		},
		{
			"address": "Jiřího Purkyně 30 50002 Hradec Králové",
			"delivery_instructions": "",
			"country": "cz",
			"restaurant_name": "Choosy Fresh Choice",
			"type": "delivery",
			"cart": {
				"items": [
					{
						"name": "Salát s gorgonzolou a hruškou...",
						"quantity": 1,
						"price": 119,
						"toppings_price": 0,
						"total_price": 119,
						"toppings": [],
						"special_requests": ""
					},
					{
						"name": "Goat Cheese Burger MENU",
						"quantity": 1,
						"price": 229,
						"toppings_price": 0,
						"total_price": 229,
						"toppings": [
							{
								"name": "BBQ omáčka",
								"price": 0
							},
							{
								"name": "Pepsi 0,33l",
								"price": 0
							}
						],
						"special_requests": ""
					},
					{
						"name": "WRAP - CAESAR",
						"quantity": 1,
						"price": 69,
						"toppings_price": 0,
						"total_price": 69,
						"toppings": [],
						"special_requests": ""
					}
				],
				"vouchers": null,
				"delivery_fee": 0,
				"total": 453
			},
			"created_at": new Date(new Date() - (1000 * 60 * 60 * 24 * 7)).toISOString()
		},
		{
			"address": "Jump Street 22 503 11 Hradec Králové",
			"delivery_instructions": "",
			"country": "cz",
			"restaurant_name": "McDonald's - Hradec Králové, Aupark",
			"type": "delivery",
			"cart": {
				"items": [
					{
						"name": "TASTY CHEESE",
						"quantity": 1,
						"price": 49,
						"toppings_price": 0,
						"total_price": 49,
						"toppings": [
							{
								"name": "Bez cibule",
								"price": 0
							}
						],
						"special_requests": ""
					},
					{
						"name": "SINGLE BIG TASTY BACON VELKÉ MCMENU™",
						"quantity": 1,
						"price": 155,
						"toppings_price": 45,
						"total_price": 200,
						"toppings": [
							{
								"name": "VELKÝ POMERANČOVÝ DŽUS (0,4l)",
								"price": 0
							},
							{
								"name": "VELKÉ HRANOLKY",
								"price": 0
							},
							{
								"name": "HERMELÍNKY 3KS  (k McMenu) s Brusinkovou Omáčkou",
								"price": 45
							}
						],
						"special_requests": ""
					},
					{
						"name": "VEGGIE WRAP VELKÉ MCMENU",
						"quantity": 1,
						"price": 155,
						"toppings_price": 0,
						"total_price": 155,
						"toppings": [
							{
								"name": "VELKÉ HRANOLKY",
								"price": 0
							},
							{
								"name": "VELKÁ VINEA (0,5l)",
								"price": 0
							},
							{
								"name": "NIC NAVÍC",
								"price": 0
							}
						],
						"special_requests": ""
					}
				],
				"vouchers": null,
				"delivery_fee": 49,
				"total": 463
			},
			"created_at": new Date(new Date() - (1000 * 60 * 60 * 24 * 3)).toISOString()
		}
	]
}
