'use strict';

import Notification from './Notification.js';
import domain from './domains.js';
import domains from './domains.js';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (shouldNotifyUser(changeInfo, tab)) {
        enablePopup(tab);
        showNotification(tab);
    }
});

function shouldNotifyUser(changeInfo, tab) {
    return changeInfo.status === 'complete' && isSafe(tab.url);
}

function isSafe(urlString) {
    try {
        const url = new URL(urlString);
        let stat = false;
        Object.keys(domains).map(function(key, index) {
            let regStr = '/.'+domains[key]+'/';
            console.log(url.hostname + ' vs ' + domains[key]);
            if(url.hostname === domains[key]){
                stat = true;
                return url.hostname.match(regStr) && url.protocol == 'https:';
            }
        });
        return stat;
    } catch (e) {
        return false;
    }
}

function enablePopup(tab) {
    chrome.pageAction.show(tab.id);
    chrome.pageAction.setIcon({
        tabId: tab.id,
        path: {
            '128': 'images/verified-icon-128.png'
        }
    });
    chrome.pageAction.setTitle({
        tabId: tab.id,
        title: chrome.i18n.getMessage('verified')
    });
}

function showNotification(tab) {
    chrome.storage.sync.get({
        automaticNotification: false,
        automaticNotificationDuration: 2
    }, (items) => {
        if (items.automaticNotification) {
            const duration = items.automaticNotificationDuration;

            Notification.make(tab, duration).show();
        }
    });
}