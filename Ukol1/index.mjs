function startGame() {
    let userNumber = Number(prompt("Zadejte číslo od 0 do 10"));
    let randNumber = getRandomArbitrary(0, 10);
    console.log("random: " + randNumber);

    while (userNumber !== randNumber) {
        let newNumber = prompt("Špatné číslo, zadejte nové číslo od 0 do 10");
        if (newNumber === null) {
            break
        }
        userNumber = Number(newNumber);
        if (userNumber === randNumber) {
            alert("Uhádli jste správné číslo!")
        }
    }
    return "Konec hry";
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
startGame();