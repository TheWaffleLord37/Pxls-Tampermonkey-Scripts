// ==UserScript==
// @name         UI Toggle Button
// @namespace    https://pxls.space/
// @version      1.0
// @description  Prepends a UI toggle button. You can customize selectors if you'd like.
// author        kaisenramen
// @match        *://pxls.space/
// @grant        none
// ==/UserScript==

(() => {
    const selectors = [
        '#ui-top',
        '#ui-bottom',
        '[data-panel="info"]',
        '[data-panel="faq"]',
        '[data-panel="notifications"]',
        '#lock-button',
        '[data-panel="settings"]',
        '[data-panel="chat"]'
    ];

    const targets = selectors.join(', ')
    const btnHtml = `
        <button id="hide-ui-button" class="panel-trigger" type="button">
            <i class="fa fa-eye"></i>
        </button>
    `;

    const setState = (on) => {
        $(targets).toggle(on);
        const $icon = $('#hide-ui-button i');
        $icon
            .toggleClass('fa-eye', on)
            .toggleClass('fa-eye-slash', !on)
            .css('opacity', on ? 1 : 0.5);
        $('#hide-ui-button').attr('aria-pressed', String(on));
    };

    const init = () => {
        if (!$('.transparent.controls .right').length || $('#hide-ui-button').length) return;

        $('.transparent.controls .right').prepend(btnHtml);
        $('#hide-ui-button').on('click', () => {
            const on = $(selectors[0]).is(':hidden');
            setState(on);
        });

        setState(true);
    };

    $(init);
})();
