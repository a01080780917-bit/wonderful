function uploadItem() {
  const itemName = document.getElementById('itemName').value;
  const category = document.getElementById('category').value;
  const location = document.getElementById('location').value;
  const contact = document.getElementById('contact').value;
  const imageInput = document.getElementById('imageInput');

  const file = imageInput.files[0];

  if (!itemName || !category || !location || !contact || !file) {
    alert('모든 정보를 입력해주세요!');
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const imageUrl = e.target.result;

    const item = {
      id: Date.now(),
      itemName,
      category,
      location,
      contact,
      imageUrl,
      chats: []
    };

    let items = JSON.parse(localStorage.getItem('lostItems')) || [];
    items.push(item);

    localStorage.setItem('lostItems', JSON.stringify(items));

    displayItems();

    clearInputs();
  };

  reader.readAsDataURL(file);
}

function clearInputs() {
  document.getElementById('itemName').value = '';
  document.getElementById('category').value = '';
  document.getElementById('location').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('imageInput').value = '';
}

function displayItems() {
  const container = document.getElementById('itemsContainer');
  container.innerHTML = '';

  let items = JSON.parse(localStorage.getItem('lostItems')) || [];

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('item-card');

    let chatHTML = '';

    item.chats.forEach(chat => {
      chatHTML += `<div class="chat-message">${chat}</div>`;
    });

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="분실물">

      <h3>${item.itemName}</h3>

      <div class="category">${item.category}</div>

      <p><strong>📍 발견 장소:</strong> ${item.location}</p>

      <p><strong>📞 연락:</strong> ${item.contact}</p>

      <div class="chat-box">
        <h4>💬 채팅</h4>

        <div class="chat-messages">
          ${chatHTML}
        </div>

        <div class="chat-input">
          <input type="text" id="chat-${item.id}" placeholder="메시지 입력">
          <button onclick="sendMessage(${item.id})">전송</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function sendMessage(id) {
  const input = document.getElementById(`chat-${id}`);
  const message = input.value;

  if (!message) {
    return;
  }

  let items = JSON.parse(localStorage.getItem('lostItems')) || [];

  items = items.map(item => {
    if (item.id === id) {
      item.chats.push(message);
    }
    return item;
  });

  localStorage.setItem('lostItems', JSON.stringify(items));

  displayItems();
}

window.onload = function() {
  displayItems();
};
