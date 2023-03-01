const apiKey = "c0ckt5b3xau_8LfYtiypjmBa676MJivT5Z5WgBdmfpkH";
const baseUrl = "https://database.deta.sh/v1/c0ckt5b3xau/global-chat";

document.addEventListener("alpine:init", () => {
  Alpine.store("globalChat", {
    listChat: [],

    isMe(name) {
      const currentName = document.getElementById("input-name").value;

      return name === currentName;
    },

    async send() {
      const name = document.getElementById("input-name").value;
      const message = document.getElementById("input-message").value;

      const date = new Date().toISOString();

      if (name && message) {
        const res = await fetch(`${baseUrl}/items`, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            item: { name, message, date },
          }),
        });

        if (res.ok) {
          document.getElementById("input-message").value = "";
        }
      }
    },

    async fetchMessages() {
      const res = await fetch(`${baseUrl}/query`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const { items } = json;

        this.listChat.splice(0, this.listChat.length);
        this.listChat = items;

        this.listChat.sort((a, b) => a.date.localeCompare(b.date));
      }
    },

    realtimeFetch() {
      setInterval(async () => {
        this.fetchMessages();
      }, 100);
    },
  });

  Alpine.store("globalChat").fetchMessages();
  Alpine.store("globalChat").realtimeFetch();
});
