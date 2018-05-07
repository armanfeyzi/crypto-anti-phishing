'use strict';

export default class Notification {
    constructor(tab, duration) {
        this.tab = tab;
        this.duration = duration;
    }

    /**
     * Make a new Notification instance
     *
     * @param  {Tab} tab
     * @param  {int} duration
     * @return {Notification}
     */
    static make(tab, duration) {
        return new Notification(tab, duration);
    }

    show() {
        const id = this.generateId();

        chrome.notifications.create(id, this.buildMessage(), () => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }

            // automatically hide the notification after 5 seconds
            setTimeout(() => {
                chrome.notifications.clear(id, () => {});
            }, this.duration * 1000);
        });

        chrome.notifications.onClicked.addListener(notificationId => {
            // hide notification on user click
            if (id === notificationId) {
                chrome.notifications.clear(notificationId, () => {});
            }
        });
    }

    buildMessage() {
        return {
            iconUrl: 'images/icon-128.png',
            type: 'basic',
            title: 'Site is Valid',
            message: 'Continue to your job',
            priority: 1
        };
    }

    generateId() {
        return `${this.tab.id}|${this.tab.url}`;
    }
}