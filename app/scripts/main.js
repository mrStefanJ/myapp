renderTiles();
renderUsers();
isLoggedIn();

jQuery('#loginModal .modal-body').load('layouts/login.html .login');
jQuery('#createArticleModal .modal-body').load('layouts/createArticle.html .create-article');

jQuery('.btn-create-article').on('click', () => {
	jQuery('#createArticleModal form').trigger('reset');
	jQuery('.error-message').remove();
	jQuery('.create-article').removeClass('error');
	jQuery('#aticleTitle').removeClass('error');
	jQuery('#aticleText').removeClass('error');
	jQuery('#aticleImage').removeClass('error');
});


function renderTiles() {
	jQuery('.card').remove();
	jQuery.ajax({
	type: 'GET',
		url: 'http://localhost:8888/api/article/read.php',
		success: (response) => {
			response.articles.map( (article) => {
				jQuery('.card-list').append(
					`<div class="card">
						<div class="image-wrapper"><img class="card-img-top" src=${article.article_images} alt="Card image cap"></div>
						<div class="update-button" data-id=${article.article_id} data-toggle="modal" data-target="#updateArticleModal"></div>
						<div class="delete-button" data-id=${article.article_id}></div>
						<div class="card-body">
							<h5 class="card-title">${article.article_title}</h5>
							<p class="card-text">${article.article_text}</p>
							<a href="#" class="btn btn-primary btn-show-article" data-id=${article.article_id}>Read more</a>
						</div>
					</div>`
				);
			});
		}
		
	})
}

function renderUsers() {
	jQuery.ajax({
		type: 'GET',
		url: 'http://localhost:8888/api/user/read.php',
		success: (response) => {
			jQuery('#dropdownUsers').append(
				` <option class="dropdown-item" data-id="0">
					All users
				  </option>`);
			response.users.map( (user) => {
				jQuery('#dropdownUsers').append(
					` <option class="dropdown-item" data-id=${user.user_id}>
						${user.user_name}
					  </option>`
				);
			});
		}		
	})
}

function isLoggedIn() {
	if ( getCookie('token')) {
		jQuery('.name').text(localStorage.getItem('userName'));
		jQuery('.login').addClass('display-none');
		jQuery('.logout').removeClass('display-none');
		jQuery('body').addClass('logged-in');
	}
}

jQuery(document).on('click', '.btn-login', (event) => {
	event.preventDefault();
	jQuery.ajax({
		type: 'GET',
		url: 'http://localhost:8888/api/user/login.php',
		data: {
			'username': jQuery('#username').val(),
			'password': jQuery('#password').val()
		},
		success: (response) => {
			if (response) {
				localStorage.setItem('userId', response.user_id);
				localStorage.setItem('userName', response.user_name);
				createCookie();
				jQuery('.name').text(response.user_name);
				jQuery('.login').addClass('display-none');
				jQuery('.logout').removeClass('display-none');
				$('#loginModal').modal('hide');
				jQuery('body').addClass('logged-in');
			}
		},
		error: (response) => {
			jQuery('.error-message').remove();
			jQuery('.login').removeClass('error');
			jQuery('.username').removeClass('error');
			jQuery('.password').removeClass('error');
			
			jQuery(`<p class="error-message">${response.responseJSON.message}</p>`).insertAfter(jQuery('.login h2'));
			
			if (!jQuery('#username').val() && !jQuery('#password').val() ) {
				jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.login .form-group'));
				jQuery('.login').addClass('error');
			}
			
			if (!jQuery('#username').val() && jQuery('#password').val()) {
				jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.login .username'));
				jQuery('.username').addClass('error');
			}

			if (jQuery('#username').val() && !jQuery('#password').val()) {
				jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.login .password'))
				jQuery('.password').addClass('error');
			}
		}
	});
});

jQuery('.logout').on('click', () => {
	jQuery('.login').removeClass('display-none');
	jQuery('.logout').addClass('display-none');
	jQuery('body').removeClass('logged-in');
	deleteCookie('token');
	localStorage.clear();
});

jQuery(document).on('click', '.btn-create', (event) => {
	event.preventDefault();
	jQuery.ajax({
		type: 'POST',
		url: 'http://localhost:8888/api/article/create.php',
		dataType: 'application/json',
		data: JSON.stringify({
			article_title: jQuery('#aticleTitle').val(),
			article_text: jQuery('#aticleText').val(),
			article_images: jQuery('#aticleImage').val(),
			user_id: Number(localStorage.getItem('userId'))
		}),
		success: (data) => {
			alert(data)
		},
		error: (data) => {
			if( data.status === 201) {
				renderTiles();
				$('#createArticleModal').modal('hide');
			} else {
				jQuery('.error-message').remove();
				jQuery('.create-article').removeClass('error');
				jQuery('#aticleTitle').removeClass('error');
				jQuery('#aticleText').removeClass('error');
				jQuery('#aticleImage').removeClass('error');
			
				jQuery(`<p class="error-message">${JSON.parse(data.responseText).message}</p>`).insertBefore(jQuery('.create-article'));
			
				if (!jQuery('#aticleTitle').val() && !jQuery('#aticleText').val() && !jQuery('#aticleImage').val() ) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article .form-group'));
					jQuery('.create-article').addClass('error');
				}
				
				if (!jQuery('#aticleTitle').val() && jQuery('#aticleText').val() && jQuery('#aticleImage').val()) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleTitle'));
					jQuery('#aticleTitle').addClass('error');
				}

				if (jQuery('#aticleTitle').val() && !jQuery('#aticleText').val() && jQuery('#aticleImage').val()) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleText'))
					jQuery('#aticleText').addClass('error');
				}

				if (jQuery('#aticleTitle').val() && jQuery('#aticleText').val() && !jQuery('#aticleImage').val()) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleImage'))
					jQuery('#aticleImage').addClass('error');
				}

				if (!jQuery('#aticleTitle').val() && !jQuery('#aticleText').val() && jQuery('#aticleImage').val()) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleTitle'));
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleText'))
					jQuery('#aticleTitle').addClass('error');
					jQuery('#aticleText').addClass('error');
				}

				if (jQuery('#aticleTitle').val() && !jQuery('#aticleText').val() && !jQuery('#aticleImage').val()) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleText'))
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleImage'))
					jQuery('#aticleText').addClass('error');
					jQuery('#aticleImage').addClass('error');
				}

				if (!jQuery('#aticleTitle').val() && jQuery('#aticleText').val() && !jQuery('#aticleImage').val()) {
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleImage'))
					jQuery('<p class="error-message">Please insert correct values</p>').insertAfter(jQuery('.create-article #aticleTitle'));
					jQuery('#aticleImage').addClass('error');
					jQuery('#aticleTitle').addClass('error');
				}
			}
		},
	});
});

jQuery('#dropdownUsers').on('change', (event) => {
	const selectedIndex = jQuery(event.currentTarget)[0].selectedIndex;
	const selectedEl = jQuery(event.currentTarget)[0][selectedIndex];
	const value = jQuery(selectedEl)[0].dataset.id;
	
	if (value == 0) {
		renderTiles();
		return;
	}
	jQuery.ajax({
		type: 'GET',
		url: 'http://localhost:8888/api/article/filter.php',
		data: {
			'user_id': value
		},
		success: (result) => {
			jQuery('.card').remove();
			result.articles.map( (article) => {
				jQuery('.card-list').append(
					`<div class="card">
						<div class="image-wrapper"><img class="card-img-top" src=${article.article_images} alt="Card image cap"></div>
						<div class="update-button" data-id=${article.article_id} data-toggle="modal" data-target="#updateArticleModal"></div>
						<div class="delete-button" data-id=${article.article_id}></div>
						<div class="card-body">
							<h5 class="card-title">${article.article_title}</h5>
							<p class="card-text">${article.article_text}</p>
							<a href="#" class="btn btn-primary btn-show-article" data-id=${article.article_id}>Read more</a>
						</div>
					</div>`
				);
			});
		},
	});
});

jQuery(document).on('click', '.delete-button', (event) => {
	const articleId  = jQuery(event.currentTarget)[0].dataset.id;
	jQuery.ajax({
		type: 'POST',
		url: 'http://localhost:8888/api/article/delete.php',
		dataType: 'application/json',
		data: JSON.stringify({
			article_id: articleId
		}),
		error: (data) => {
			if( data.status === 200) {
				renderTiles();
				$('#createArticleModal').modal('hide');
			} else {
				console.log(data.responseText)
			}
		},
	});
});

jQuery(document).on('click', '.update-button', (event) => {
	jQuery('#updateArticleModal .modal-body').load('layouts/updateArticle.html .update-article');
	const articleId = jQuery(event.currentTarget)[0].dataset.id;
	jQuery.ajax({
		type: 'GET',
		url: 'http://localhost:8888/api/article/read_one.php',
		data: {
			'article_id': articleId
		},
		success: (result) => {
			result.articles.map( (article) => {
				jQuery('#updateArticleModal #aticleTitle').val(article.article_title);
				jQuery('#updateArticleModal #aticleImage').val(article.article_images);
				jQuery('#updateArticleModal #aticleText').val(article.article_text);
				document.querySelector('#updateArticleModal .btn-update').setAttribute('data-id', article.article_id);
			});
		},
	});
});

jQuery(document).on('click', '.btn-update', (event) => { 
	jQuery.ajax({
		type: 'POST',
		url: 'http://localhost:8888/api/article/update.php',
		dataType: 'application/json',
		data: JSON.stringify({
			article_id: $(event.currentTarget)[0].dataset.id,
			article_title: jQuery('#updateArticleModal #aticleTitle').val(),
			article_text: jQuery('#updateArticleModal #aticleText').val(),
			article_images: jQuery('#updateArticleModal #aticleImage').val(),
			user_id: localStorage.getItem('userId')
		}),
		error: (data) => {
			if( data.status === 200) {
				renderTiles();
				$('#updateArticleModal').modal('hide');
			} else {
				console.log(data.responseText)
			}
		},
	});
});

jQuery(document).on('click', '.btn-show-article', (event) => {
	jQuery('.article-wrapper').load('layouts/article.html .article');
	const articleId = $(event.currentTarget)[0].dataset.id;
	jQuery.ajax({
		type: 'GET',
		url: 'http://localhost:8888/api/article/read_one.php',
		data: {
			'article_id': articleId
		},
		success: (result) => {
			result.articles.map( (article) => {
				jQuery('.card').remove();
				jQuery('.article-title').text(article.article_title);
				document.querySelector('.article-image').setAttribute('src',article.article_images);
				jQuery('.article-text').text(article.article_text);
				jQuery('.author-name').text(article.user_name)
				document.querySelector('.update-button').setAttribute('data-id', article.article_id);
				document.querySelector('.delete-button').setAttribute('data-id', article.article_id);
			});
		},
	});
})

jQuery(document).on('click', '.btn-goBack', () => {
	jQuery('.article-wrapper div').remove();
	renderTiles();
})

jQuery(document).on('click', '.add_form_field', () => {
	jQuery('<input type="text" class="form-control" id="aticleImage" placeholder="Image"></input>').insertAfter(jQuery('#aticleImage'));
});

function createCookie() {
	const date = new Date();
	date.setTime(date.getTime()+(1*24*60*60*1000));        
	const expires = '; expires='+date.toGMTString();

	document.cookie = 'token='+Math.random()+expires+'; path=/';
}

function deleteCookie( name ) {
		if (getCookie(name )) {
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
  }

function getCookie(name) {
	var nameEQ = name + '='
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

jQuery(document).on('click', '.eye', (event) => {
    const x = document.getElementById('password');
    if (x.type === 'password') {
		$(event.currentTarget).removeClass('eye-closed');
    	x.type = 'text';
    } else {
		x.type = 'password';
		$(event.currentTarget).addClass('eye-closed');
	}
});