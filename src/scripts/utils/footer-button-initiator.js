import config from '../globals/config';
import notificationHelper from './notification-helper';

const footerButtonInitiator = {
  async init({ subscribeButton, unsubscribeButton }) {
    this._subscribeButton = subscribeButton;
    this._unsubscribeButton = unsubscribeButton;
    this._registrationServiceWorker = null;

    if ('serviceWorker' in navigator) {
      this._registrationServiceWorker =
        await navigator.serviceWorker.getRegistration();
    }

    await this._initialListener();
    await this._initialState();
  },

  async _initialListener() {
    this._subscribeButton.addEventListener('click', async (event) => {
      this._subscribePushMessage(event);
    }),
      this._unsubscribeButton.addEventListener('click', async (event) => {
        this._unsubscribePushMessage(event);
      });
  },

  async _initialState() {},

  async _subscribePushMessage(event) {
    event.stopPropagation();

    if (await this._isCurrentSubscriptionAvailable()) {
      window.alert('Already subscribe to push message');
      return;
    }
    if (!(await this._isNotificationReady())) {
      console.log("Notification isn't available");
      return;
    }

    console.log('_subscribePushMessage: Subscribing to push message...');
    const pushSubsciption =
      await this._registrationServiceWorker?.pushManager.subscribe(
        this._generateSubscribeOptions()
      );
    if (!pushSubsciption) {
      console.log('Subscribe Push Message Failed');
      return;
    }
    try {
      await this._sendPostToServer(
        config.PUSH_MSG_SUBSCRIBE_URL,
        pushSubsciption
      );
      console.log('push Message has been subscribed');
    } catch (error) {
      console.log('Subscribe Push Message Failed', error.message);
      await pushSubsciption?.unsubscribe();
    }
  },
  async _unsubscribePushMessage(event) {
    event.stopPropagation();
    console.log('Unsubscribe Push Message');
  },

  _urlB64ToUint8array: (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  _generateSubscribeOptions() {
    return {
      userVisibleOnly: true,
      applicationServerKey: this._urlB64ToUint8array(
        config.PUSH_MSG_VAPID_PUBLIC_KEY
      ),
    };
  },

  async _sendPostToServer(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },
  async _sendPostToServer(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  _isSubscribedToServerForHiddenSubscribeButton(state = false) {
    if (state) {
      this._subscribeButton.style.display = 'none';
      this._unsubscribeButton.style.display = 'inline-block';
    } else {
      this._subscribeButton.style.display = 'inline-block';
      this._unsubscribeButton.style.display = 'none';
    }
  },

  async _isCurrentSubscriptionAvailable() {
    const checkSubscription =
      await this._registrationServiceWorker?.pushManager.getSubscription();
    return Boolean(checkSubscription);
  },

  async _isNotificationReady() {
    if (!notificationHelper._checkAvailability()) {
      console.log('Notification not supported in this browser');
      return false;
    }
    if (!notificationHelper._checkPermission()) {
      console.log('User did not granted the notification permission yet');
      const status = await Notification.requestPermission();
      if (status === 'denied') {
        window.alert(
          'Cannot subscribe to push message because the status of notification permission is denied'
        );
        return false;
      }
      if (status === 'default') {
        window.alert(
          'Cannot subscribe to push message because the status of notification permission is ignored'
        );
        return false;
      }
    }
    return true;
  },
};

export default footerButtonInitiator;
