// Отправляем бронь на наш сервер, он пересылает её в Telegram-бот хозяйки
$("#book").on("submit", function (e) {
  e.preventDefault();
  const phone = $(this).find("[name=phone]").val();
  fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
});
