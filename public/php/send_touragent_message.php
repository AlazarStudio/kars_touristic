<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $touragent = $_POST['touragent'];
    $text = $_POST['text'];

    $to = $touragent;
    $subject = "Новое сообщение с сайта karstouristic.ru";
    $message = $text;
    $headers = "From: kars-touristic@mail.ru";

    if (mail($to, $subject, $message, $headers)) {
        echo "Сообщение отправлено успешно!";
    } else {
        echo "Ошибка при отправке сообщения.";
    }
} else {
    echo "Некорректный метод запроса.";
}
?>
