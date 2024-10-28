const notificationHelper = {
  sendNotification({ title, option }) {
    if (!this._checkAvailability()) {
      console.log('Notification not supported');
      return;
    }

    if (!this._checkPermission()) {
      console.log('User did not yet granted permission');
      this._requestPermission();
      return;
    }
    this._showNotification({ title, option });
  },
  _checkAvailability() {
    return 'Notification' in window;
  },

  _checkPermission() {
    return Notification.permission === 'granted';
  },

  async _requestPermission() {
    const status = await Notification.requestPermission();
    if (status === 'denied') {
      console.log('Notification Denied');
    }

    if (status === 'default') {
      console.log('Permission Closed');
    }
  },

  async _showNotification({ title, option }) {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    serviceWorkerRegistration.showNotification(title, option);
  },
};
export default notificationHelper;
