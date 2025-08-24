// basic HTML escape
const escapeHtml = (unsafeStr) => {
    if (!unsafeStr) unsafeStr=''; 
    return unsafeStr
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// Replace Emoji Short codes with their pictorial representation
const replaceEmoji = (string, emojis) => {
    emojis.forEach(emoji => {
        string = string.replaceAll(`:${emoji.shortcode}:`, `<img src="${escapeHtml(emoji.static_url)}" width="20" height="20">`)
    });
    return string;
}

loadComments = (mastodonPostUrl, container) => {
    // return if not valid url - this is because omg.lol doesn't allow conditionals in the calling HTML
	if(mastodonPostUrl === ''|| mastodonPostUrl === '{' + 'mastodon}') { // need to split the mastodon placeholder, to ensure that it isn't been replaced with the txt.
        return false;
    }   
    // convert the supplied mastodon post url to the relevant endpoint URL, by replacing `@username` with `api/v1/statuses` and appending `/context`
    const mastodonApiUrl = mastodonPostUrl.replace(/@[^\/]+/, 'api/v1/statuses') + '/context';
    // fetch replies and get JSON
    fetch(mastodonApiUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.descendants) {
                container.innerHTML = `
                <h2>Comentários</h2>

                <p><button class="addComment">Adicione um comentário</button></p>

                <div class="comment-list">
                    ${data.descendants.reduce((html, status) => {
                        return html + `
                        <div class="comment">
                            <div class="avatar">
                                <img src="${status.account.avatar_static}" height="60" width="60" alt="">
                            </div>
                            <div class="content">
                                <div class="author">
                                    <a target="_blank" href="${status.account.url}" rel="nofollow">
                                        <span>${replaceEmoji(escapeHtml(status.account.display_name), status.account.emojis)}</span>
                                    </a>
                                    <a target="_blank" class="date" href="${status.url}" rel="nofollow">
                                        ${new Date(status.created_at).toLocaleString()}
                                    </a>
                                </div>
                                <div class="mastodon-comment-content">${replaceEmoji(status.content, status.emojis)}</div> 
                            </div>
                        </div>
                    `}, '')}
                </div>

                ${data.descendants.length > 1 ? `<p><button class="addComment">Adicione um comentário</button></p>` : '' }
                
                <dialog id="comment-dialog">
                    <h3>Comente este post</h3>
                    <button title="Cancelar" id="close">&times;</button>
                    <p>
                        Suas respostas no Mastodon (ou outro serviço compatível) aparecerão automaticamente aqui. Basta informar a sua instância, e responder diretamente nela:
                    <p>

                    <p class="input-row">
                        <input type="text" inputmode="url" autocapitalize="none" autocomplete="off"
                            value="${ escapeHtml(localStorage.getItem('mastodonUrl')) ?? '' }" id="instanceName"
                            placeholder="mastodon.social">
                        <button class="button" id="go">Ir</button>
                    </p>

                    <p>Se preferir, copie a URL abaixo e cole na busca do seu app do Mastodon:</p>
                    <p class="input-row">
                        <input type="text" readonly id="copyInput" value="${ mastodonPostUrl }">
                        <button class="button" id="copy">Copiar</button>
                    </p>
                </dialog>


                `;

                const dialog = document.getElementById('comment-dialog');

                // open dialog on button click
                Array.from(document.getElementsByClassName('addComment')).forEach(button => button.addEventListener('click', () => {
                    dialog.showModal();
                    // this is a very very crude way of not focusing the field on a mobile device.
                    // the reason we don't want to do this, is because that will push the modal out of view
                    if(dialog.getBoundingClientRect().y > 100) {
                        document.getElementById('instanceName').focus();
                    }
                }));

                // when click on 'Go' button: go to the instance specified by the user
                document.getElementById('go').addEventListener('click', () => {
                    let url = document.getElementById('instanceName').value.trim();
		    if (url === '') {
			// bail out - window.alert is not very elegant, but it works
			window.alert('Informe o endereço da sua instância.');
			return;
		    }

		    // store the url in the local storage for next time
		    localStorage.setItem('mastodonUrl', url);

		    if (!url.startsWith('https://')) {
			url = `https://${url}`;
		    }

		    window.open(`${url}/authorize_interaction?uri=${mastodonPostUrl}`, '_blank');
                });

                // also when pressing enter in the input field
                document.getElementById('instanceName').addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                        document.getElementById('go').dispatchEvent(new Event('click'));
                    }
                });

                // copy tye post's url when pressing copy
                document.getElementById('copy').addEventListener('click', () => {
                    // select the input field, both for visual feedback, and so that the user can use CTRL/CMD+C for manual copying, if they don't trust you
                    document.getElementById('copyInput').select();
                    navigator.clipboard.writeText(mastodonPostUrl);
                    // Confirm this by changing the button text
                    document.getElementById('copy').innerHTML = 'Copiado!';
                    // restore button text after a second.
                    window.setTimeout(() => {
                        document.getElementById('copy').innerHTML = 'Copiar';
                    }, 1000);
                });

                // close dialog on button click, or escape button
                document.getElementById('close').addEventListener('click', () => {
                    dialog.close();
                });
                dialog.addEventListener('keydown', e => {
                    if (e.key === 'Escape') dialog.close();
                });

                // Close dialog, if clicked on backdrop
                dialog.addEventListener('click', event => {
                    var rect = dialog.getBoundingClientRect();
                    var isInDialog=
                           rect.top <= event.clientY 
                        && event.clientY <=rect.top + rect.height 
                        && rect.left<=event.clientX 
                        && event.clientX <=rect.left + rect.width;
                    if (!isInDialog) { 
                        dialog.close(); 
                    }
                })


            }
            return '';
        })
} 